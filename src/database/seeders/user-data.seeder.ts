import { Injectable, Logger } from "@nestjs/common";
import { UserService } from "src/modules/user/user.service";
import { AccountService } from "src/modules/account/account.service";
import { TransactionService } from "src/modules/transaction/transaction.service";
import { CategoryService } from "src/modules/category/category.service";
import { SubcategoryService } from "src/modules/subcategory/subcategory.service";
import { AccountTypeEnum } from "src/enum/account-type.enum";
import { CategoryTypeEnum } from "src/enum/category-type.enum";
import { RecurrencePeriodEnum } from "src/enum/recurrence-period.enum";
import { Account } from "src/modules/account/entitites/account.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/modules/category/entities/category.entity";
import { Subcategory } from "src/modules/subcategory/entities/subcategory.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserDataSeeder {
    private readonly logger = new Logger(UserDataSeeder.name);

    constructor(
        private readonly userService: UserService,
        private readonly accountService: AccountService,
        private readonly transactionService: TransactionService,
        private readonly categoryService: CategoryService,
        private readonly subcategoryService: SubcategoryService,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Subcategory)
        private subcategoryRepository: Repository<Subcategory>,
    ) { }

    async seed() {
        try {
            // 1. Crear usuario de prueba
            const user = await this.createTestUser();
            this.logger.log('Usuario de prueba creado');

            // 2. Crear cuentas de prueba
            const accounts = await this.createTestAccounts(user);
            this.logger.log('Cuentas de prueba creadas');

            // 3. Crear transacciones de prueba
            await this.createTestTransactions(user, accounts);
            this.logger.log('Transacciones de prueba creadas');

        } catch (error) {
            this.logger.error('Error al crear datos de prueba:', error);
            throw error;
        }
    }

    private async createTestUser() {
        const testUser = {
            first_name: "Usuario",
            last_name: "Prueba",
            email: "usuario@prueba.com",
            password: "123456",
            language_preference: "es",
            currency_preference: "ARS",
            role: "user"
        };

        try {
            return await this.userService.create(testUser);
        } catch (error) {
            // Si el usuario ya existe, lo buscamos
            return await this.userService.findByEmail(testUser.email);
        }
    }

    private async createTestAccounts(user: any) {
        const accounts = [
            {
                name: "Cuenta Principal",
                type: AccountTypeEnum.BANK_ACCOUNT,
                current_balance: 50000,
                currency: "ARS"
            },
            {
                name: "Efectivo",
                type: AccountTypeEnum.CASH,
                current_balance: 10000,
                currency: "ARS"
            },
            {
                name: "Tarjeta de Crédito",
                type: AccountTypeEnum.CREDIT_CARD,
                current_balance: -15000,
                currency: "ARS"
            },
            {
                name: "Caja de Ahorro",
                type: AccountTypeEnum.SAVINGS,
                current_balance: 100000,
                currency: "ARS"
            }
        ];

        const createdAccounts: Account[] = [];
        for (const account of accounts) {
            const createdAccount = await this.accountService.create(account, user);
            createdAccounts.push(createdAccount);
        }

        return createdAccounts;
    }

    private async createTestTransactions(user: any, accounts: Account[]) {
        // Obtener algunas categorías y subcategorías
        const categories = await this.categoryRepository.find({
            relations: ['type']
        });
        const gastosCategory = categories.find(c => c.type.name === CategoryTypeEnum.GASTO);
        const ingresosCategory = categories.find(c => c.type.name === CategoryTypeEnum.INGRESO);

        if (!gastosCategory || !ingresosCategory) {
            throw new Error('No se encontraron las categorías necesarias para crear las transacciones');
        }

        const subcategories = await this.subcategoryRepository.find({
            relations: ['category']
        });
        const gastosSubcategories = subcategories.filter(s => s.category.id === gastosCategory.id);
        const ingresosSubcategories = subcategories.filter(s => s.category.id === ingresosCategory.id);

        if (gastosSubcategories.length === 0 || ingresosSubcategories.length === 0) {
            throw new Error('No se encontraron las subcategorías necesarias para crear las transacciones');
        }

        // Crear transacciones de gastos
        const gastos = [
            {
                amount: Number(-5000),
                description: "Supermercado",
                date: new Date(),
                subcategory_id: gastosSubcategories[0].id,
                account_id: accounts[0].id,
                is_recurring: true,
                recurrence_period: RecurrencePeriodEnum.MONTHLY
            },
            {
                amount: Number(-2000),
                description: "Transporte",
                date: new Date(),
                subcategory_id: gastosSubcategories[1].id,
                account_id: accounts[1].id
            },
            {
                amount: Number(-15000),
                description: "Tarjeta de Crédito",
                date: new Date(),
                subcategory_id: gastosSubcategories[2].id,
                account_id: accounts[2].id,
                is_recurring: true,
                recurrence_period: RecurrencePeriodEnum.MONTHLY
            }
        ];

        // Crear transacciones de ingresos
        const ingresos = [
            {
                amount: Number(150000),
                description: "Salario",
                date: new Date(),
                subcategory_id: ingresosSubcategories[0].id,
                account_id: accounts[0].id,
                is_recurring: true,
                recurrence_period: RecurrencePeriodEnum.MONTHLY
            },
            {
                amount: Number(5000),
                description: "Freelance",
                date: new Date(),
                subcategory_id: ingresosSubcategories[1].id,
                account_id: accounts[0].id
            }
        ];

        // Insertar todas las transacciones
        for (const transaction of [...gastos, ...ingresos]) {
            await this.transactionService.create(transaction, user);
        }
    }
} 