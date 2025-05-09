import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CategoryType } from "../../category-type/entities/category_type.entity";

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ length: 50, nullable: true })
    icon: string;

    @Column({ length: 7, nullable: true })
    color: string;

    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @ManyToOne(() => CategoryType, { eager: true })
    type: CategoryType;
}