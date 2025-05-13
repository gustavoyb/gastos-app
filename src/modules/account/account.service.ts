import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { User } from '../user/entities/user.entity';
import { Account } from './entitites/account.entity';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
    ) { }

    /**
     * Crea una nueva cuenta para un usuario
     */
    async create(createAccountDto: CreateAccountDto, user: User): Promise<Account> {
        const account = this.accountRepository.create({
            ...createAccountDto,
            user,
        });

        return this.accountRepository.save(account);
    }

    /**
     * Obtiene todas las cuentas de un usuario
     */
    async findAllByUser(userId: number): Promise<Account[]> {
        return this.accountRepository.find({
            where: { user: { id: userId } },
            order: { created_at: 'DESC' },
        });
    }

    /**
     * Obtiene todas las cuentas activas de un usuario
     */
    async findActiveByUser(userId: number): Promise<Account[]> {
        return this.accountRepository.find({
            where: {
                user: { id: userId },
                is_active: true,
            },
            order: { name: 'ASC' },
        });
    }

    /**
     * Encuentra una cuenta por ID y verifica que pertenezca al usuario
     */
    async findOne(id: number, userId: number): Promise<Account> {
        const account = await this.accountRepository.findOne({
            where: {
                id,
                user: { id: userId },
            },
            relations: ['user'],
        });

        if (!account) {
            throw new NotFoundException(`Cuenta con ID ${id} no encontrada o no pertenece al usuario`);
        }

        return account;
    }

    /**
     * Actualiza una cuenta existente
     */
    async update(id: number, updateAccountDto: UpdateAccountDto, userId: number): Promise<Account> {
        // Verificar que la cuenta existe y pertenece al usuario
        const account = await this.findOne(id, userId);

        // Actualizar los campos
        const updatedAccount = this.accountRepository.merge(account, updateAccountDto);

        return this.accountRepository.save(updatedAccount);
    }

    /**
     * Desactiva una cuenta (soft delete)
     */
    async deactivate(id: number, userId: number): Promise<Account> {
        const account = await this.findOne(id, userId);
        account.is_active = false;

        return this.accountRepository.save(account);
    }

    /**
     * Reactiva una cuenta previamente desactivada
     */
    async activate(id: number, userId: number): Promise<Account> {
        const account = await this.findOne(id, userId);
        account.is_active = true;

        return this.accountRepository.save(account);
    }

    /**
     * Elimina permanentemente una cuenta (usar con cuidado)
     */
    async remove(id: number, userId: number): Promise<void> {
        const account = await this.findOne(id, userId);
        await this.accountRepository.remove(account);
    }

    /**
     * Actualiza el saldo de una cuenta
     */
    async updateBalance(id: number, amount: number, userId: number): Promise<Account> {
        const account = await this.findOne(id, userId);
        account.current_balance += amount;

        return this.accountRepository.save(account);
    }

    /**
     * Obtiene el saldo total de todas las cuentas activas del usuario
     */
    async getTotalBalance(userId: number): Promise<{ total: number, byCurrency: Record<string, number> }> {
        const accounts = await this.findActiveByUser(userId);

        // Calcular saldo total por moneda
        const totals: Record<string, number> = {};
        let overallTotal = 0;

        accounts.forEach(account => {
            if (!totals[account.currency]) {
                totals[account.currency] = 0;
            }

            totals[account.currency] += Number(account.current_balance);

            // Para el total general, asumimos la misma moneda (esto es simplificado)
            // En un caso real, habría que convertir monedas
            overallTotal += Number(account.current_balance);
        });

        return {
            total: overallTotal,
            byCurrency: totals,
        };
    }
}