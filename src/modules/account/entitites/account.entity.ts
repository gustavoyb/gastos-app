import { AccountTypeEnum } from "src/enum/account-type.enum";
import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('account')
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: AccountTypeEnum,
        default: AccountTypeEnum.BANK_ACCOUNT
    })
    type: AccountTypeEnum;

    @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
    current_balance: number;

    @Column({ length: 3, default: 'ARS' })
    currency: string;

    @Column({ default: true })
    is_active: boolean;

    @ManyToOne(() => User)
    user: User;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;
}