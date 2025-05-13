import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Subcategory } from "../../subcategory/entities/subcategory.entity";
import { User } from "../../user/entities/user.entity";
import { Account } from "../../account/entitites/account.entity";
import { RecurrencePeriodEnum } from "src/enum/recurrence-period.enum";

@Entity('transaction')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'date' })
    date: Date;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => Subcategory, { eager: true })
    @JoinColumn({ name: 'subcategory_id' })
    subcategory: Subcategory;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @Column({ default: false })
    is_recurring: boolean;

    @Column({
        nullable: true,
        type: 'enum',
        enum: RecurrencePeriodEnum
    })
    recurrence_period: RecurrencePeriodEnum;

    @Column({ nullable: true })
    notes: string;

    @Column({ nullable: true })
    tags: string; // Puede ser un campo JSON o un string separado por comas

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;
}