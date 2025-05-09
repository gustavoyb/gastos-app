import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";
import { CategoryTypeService } from "../category-type/category-type.service";
import { CategoryDto } from "./dto/category.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        private categoryTypeService: CategoryTypeService,
    ) { }

    async create(categoryDto: CategoryDto): Promise<Category> {
        const type = await this.categoryTypeService.findOneByName(categoryDto.typeName);
        if (!type) {
            throw new Error(`Category type ${categoryDto.typeName} not found`);
        }

        const category = this.categoryRepository.create({
            name: categoryDto.name,
            description: categoryDto.description,
            icon: categoryDto.icon,
            color: categoryDto.color,
            type,
        });

        return this.categoryRepository.save(category);
    }

    async findOneByName(name: string): Promise<Category | null> {
        return this.categoryRepository.findOne({
            where: { name },
            relations: ['type'],
        });
    }
}
