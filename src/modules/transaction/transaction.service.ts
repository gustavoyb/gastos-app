import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { SubcategoryService } from "../subcategory/subcategory.service";
import { AccountService } from "../account/account.service";
import { Between, FindOptionsWhere, Like, Repository } from "typeorm";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { User } from "../user/entities/user.entity";
import { FilterTransactionDto } from "./dto/filter-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { CategoryTypeEnum } from "src/enum/category-type.enum";

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        private subcategoryService: SubcategoryService,
        private accountService: AccountService,
    ) { }

    /*
    Crea una nueva transacción
    */
    async create(createTransactionDto: CreateTransactionDto, user: User): Promise<Transaction> {
        const subcategory = await this.subcategoryService.findOne(createTransactionDto.subcategory_id);
        const account = await this.accountService.findOne(createTransactionDto.account_id, user.id);

        const transaction = this.transactionRepository.create({
            ...createTransactionDto,
            subcategory,
            account,
            user,
        });

        const savedTransaction = await this.transactionRepository.save(transaction);

        await this.accountService.updateBalance(account.id, transaction.amount, user.id);
        return savedTransaction;
    }

    /**
   * Encuentra todas las transacciones de un usuario con filtros
   */
    async findAll(filterDto: FilterTransactionDto, userId: number): Promise<{ data: Transaction[], total: number, page: number, limit: number }> {
        const {
            start_date, end_date, min_amount, max_amount, type,
            category_id, subcategory_id, account_id, is_recurring,
            recurrence_period, search, tags, page = 1, limit = 10,
            sort_by = 'date', sort_order = 'DESC'
        } = filterDto;

        // Construir las condiciones del where
        const where: FindOptionsWhere<Transaction> = {
            user: { id: userId },
        };

        // Filtrar por fechas
        if (start_date && end_date) {
            where.date = Between(start_date, end_date);
        } else if (start_date) {
            where.date = Between(start_date, new Date());
        } else if (end_date) {
            where.date = Between(new Date(0), end_date);
        }

        // Filtrar por monto
        if (min_amount !== undefined && max_amount !== undefined) {
            where.amount = Between(min_amount, max_amount);
        } else if (min_amount !== undefined) {
            where.amount = Between(min_amount, 9999999.99);
        } else if (max_amount !== undefined) {
            where.amount = Between(-9999999.99, max_amount);
        }

        // Filtrar por subcategoría
        if (subcategory_id) {
            where.subcategory = { id: subcategory_id };
        }

        // Filtrar por tipo de categoría (gasto o ingreso)
        if (type) {
            where.subcategory = {
                category: { type: { name: type } }
            };
        }

        // Filtrar por categoría
        if (category_id) {
            where.subcategory = {
                category: { id: category_id }
            };
        }

        // Filtrar por cuenta
        if (account_id) {
            where.account = { id: account_id };
        }

        // Filtrar por recurrencia
        if (is_recurring !== undefined) {
            where.is_recurring = is_recurring;
        }

        if (recurrence_period) {
            where.recurrence_period = recurrence_period;
        }

        // Búsqueda por texto
        if (search) {
            where.description = Like(`%${search}%`);
            // También se podría buscar en notas, pero TypeORM no admite OR en FindOptionsWhere directamente
        }

        // Filtrar por etiquetas
        if (tags && tags.length > 0) {
            // Esto es una simplificación; para búsqueda avanzada de tags necesitarías una consulta personalizada
            // Asumimos que los tags son guardados como string separado por comas
            const tagConditions = tags.map(tag => `%${tag}%`);
            where.tags = Like(tagConditions[0]); // Simplificado para el primer tag
        }

        // Calcular skip para paginación
        const skip = (page - 1) * limit;

        // Crear objeto de ordenamiento
        const order = {};
        order[sort_by] = sort_order;

        // Realizar la consulta con paginación
        const [data, total] = await this.transactionRepository.findAndCount({
            where,
            relations: ['subcategory', 'subcategory.category', 'account'],
            order,
            skip,
            take: limit,
        });

        return {
            data,
            total,
            page,
            limit,
        };
    }

    /*
    Encuentra una transacción por ID y verifica que pertenezca al usuario
    */
    async findOne(id: number, userId: number): Promise<Transaction> {
        const transaction = await this.transactionRepository.findOne({
            where: {
                id,
                user: { id: userId },
            },
            relations: ['subcategory', 'subcategory.category', 'account', 'user'],
        });

        if (!transaction) {
            throw new NotFoundException(`Transacción con ID ${id} no encontrada o no pertenece al usuario`);
        }

        return transaction;
    }

    /*
    Actualiza una transacción existente
    */
    async update(id: number, updateTransactionDto: UpdateTransactionDto, userId: number): Promise<Transaction> {
        const transaction = await this.findOne(id, userId);

        // Si se está actualizando el monto, guardar el monto anterior para ajustar el saldo de la cuenta
        const oldAmount = transaction.amount;
        const oldAccountId = transaction.account.id;

        // Si se está actualizando la subcategoría
        let subcategory = transaction.subcategory;
        if (updateTransactionDto.subcategory_id && updateTransactionDto.subcategory_id !== subcategory.id) {
            subcategory = await this.subcategoryService.findOne(updateTransactionDto.subcategory_id);
        }

        // Si se está actualizando la cuenta
        let account = transaction.account;
        if (updateTransactionDto.account_id && updateTransactionDto.account_id !== account.id) {
            account = await this.accountService.findOne(updateTransactionDto.account_id, userId);
        }

        // Crear el objeto con los datos actualizados
        const updatedTransaction = this.transactionRepository.merge(transaction, {
            ...updateTransactionDto,
            subcategory,
            account,
        });

        // Guardar la transacción actualizada
        const savedTransaction = await this.transactionRepository.save(updatedTransaction);

        // Si cambió el monto o la cuenta, actualizar los saldos
        if (oldAmount !== savedTransaction.amount || oldAccountId !== savedTransaction.account.id) {
            // Revertir el efecto en la cuenta anterior
            await this.accountService.updateBalance(oldAccountId, -oldAmount, userId);

            // Aplicar el nuevo efecto en la cuenta actual
            await this.accountService.updateBalance(savedTransaction.account.id, savedTransaction.amount, userId);
        }

        return savedTransaction;
    }

    /*
    Elimina una transacción
    */
    async remove(id: number, userId: number): Promise<void> {
        const transaction = await this.findOne(id, userId);

        // Revertir el efecto en el saldo de la cuenta
        await this.accountService.updateBalance(transaction.account.id, -transaction.amount, userId);

        // Eliminar la transacción
        await this.transactionRepository.remove(transaction);
    }

    /*
    Obtiene un resumen de las transacciones agrupadas por categoría
    */
    async getSummaryByCategory(userId: number, startDate?: Date, endDate?: Date, type?: CategoryTypeEnum): Promise<any[]> {
        // Configurar fechas por defecto si no se proporcionan
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const start = startDate || firstDayOfMonth;
        const end = endDate || lastDayOfMonth;

        // Construir la consulta base
        const query = this.transactionRepository
            .createQueryBuilder('transaction')
            .innerJoin('transaction.subcategory', 'subcategory')
            .innerJoin('subcategory.category', 'category')
            .where('transaction.user_id = :userId', { userId })
            .andWhere('transaction.date BETWEEN :start AND :end', { start, end });

        // Filtrar por tipo si se especifica
        if (type) {
            query.andWhere('category.type.name = :type', { type });
        }

        // Agrupar y sumar
        const summary = await query
            .select([
                'category.id AS category_id',
                'category.name AS category_name',
                'category.icon AS category_icon',
                'category.color AS category_color',
                'SUM(transaction.amount) AS total_amount',
                'COUNT(transaction.id) AS transaction_count',
            ])
            .groupBy('category.id')
            .addGroupBy('category.name')
            .addGroupBy('category.icon')
            .addGroupBy('category.color')
            .orderBy('total_amount', type === CategoryTypeEnum.GASTO ? 'DESC' : 'ASC')
            .getRawMany();

        return summary;
    }

    /**
   * Obtiene un resumen de las transacciones por mes
   */
    async getMonthlySummary(userId: number, year: number, type?: CategoryTypeEnum): Promise<any[]> {
        // Construir consulta base
        const query = this.transactionRepository
            .createQueryBuilder('transaction')
            .innerJoin('transaction.subcategory', 'subcategory')
            .innerJoin('subcategory.category', 'category')
            .where('transaction.user_id = :userId', { userId })
            .andWhere('EXTRACT(YEAR FROM transaction.date) = :year', { year });

        // Filtrar por tipo si se especifica
        if (type) {
            query.andWhere('category.type.name = :type', { type });
        }

        // Agrupar por mes y sumar
        const summary = await query
            .select([
                'EXTRACT(MONTH FROM transaction.date) AS month',
                'SUM(transaction.amount) AS total_amount',
                'COUNT(transaction.id) AS transaction_count',
            ])
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();

        // Procesar para incluir todos los meses (incluso los que no tienen transacciones)
        const result: { month: number; total_amount: number; transaction_count: number; }[] = [];
        for (let month = 1; month <= 12; month++) {
            const monthData = summary.find(item => parseInt(item.month) === month);
            result.push({
                month,
                total_amount: monthData ? parseFloat(monthData.total_amount) : 0,
                transaction_count: monthData ? parseInt(monthData.transaction_count) : 0,
            });
        }

        return result;
    }

}