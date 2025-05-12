import { Exclude } from "class-transformer";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Transaction } from "src/modules/transaction/entities/transaction.entity";
import { Account } from "src/modules/account/entitites/account.entity";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    first_name: string;

    @Column({ length: 50 })
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude() // Excluye este campo al serializar (para respuestas HTTP)
    password: string;

    @Column({ nullable: true })
    profile_image: string;

    @Column({ default: false })
    email_verified: boolean;

    @Column({ nullable: true })
    email_verification_token: string;

    @Column({ nullable: true })
    password_reset_token: string;

    @Column({ nullable: true })
    password_reset_expires: Date;

    @Column({ default: 'es' })
    language_preference: string;

    @Column({ default: 'ARS' })
    currency_preference: string;

    @Column({ nullable: true, type: 'json' })
    notification_preferences: object;

    @Column({ default: true })
    is_active: boolean;

    @Column({ default: 'user' })
    role: string; // 'user', 'admin', etc.

    @Column({ nullable: true })
    last_login: Date;

    @OneToMany(() => Transaction, transaction => transaction.user)
    transactions: Transaction[];

    @OneToMany(() => Account, account => account.user)
    accounts: Account[];

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;

    // Método getter para obtener el nombre completo
    get full_name(): string {
        return `${this.first_name} ${this.last_name}`;
    }

    // Hash de contraseña antes de insertar o actualizar
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        // Solo aplicar hash si la contraseña ha sido modificada
        if (this.password) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    // Método para validar contraseña
    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}