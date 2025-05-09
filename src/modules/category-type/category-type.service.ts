import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryType } from "./entities/category_type.entity";
import { Repository } from "typeorm";
import { CategoryTypeDto } from "./dto/category-type.dto";
import { CategoryTypeEnum } from "src/enum/category-type.enum";

@Injectable()
export class CategoryTypeService {
    constructor(
        @InjectRepository(CategoryType)
        private categoryTypeRepository: Repository<CategoryType>,
    ) { }

    async create(categoryTypeDto: CategoryTypeDto): Promise<CategoryType> {
        const categoryType = this.categoryTypeRepository.create(categoryTypeDto);
        return this.categoryTypeRepository.save(categoryType);
    }

    async findOneByName(name: CategoryTypeEnum): Promise<CategoryType | null> {
        return this.categoryTypeRepository.findOne({ where: { name } });
    }

    async findAll(): Promise<CategoryType[]> {
        return this.categoryTypeRepository.find();
    }
}