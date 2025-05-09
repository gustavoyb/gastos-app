import { CategoryTypeEnum } from "src/enum/category-type.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('category_type')
export class CategoryType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: CategoryTypeEnum,
        default: CategoryTypeEnum.GASTO
    })
    name: CategoryTypeEnum;

    @Column({ nullable: true })
    description: string;
}