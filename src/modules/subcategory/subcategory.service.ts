import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subcategory } from "./entities/subcategory.entity";
import { Repository } from "typeorm";
import { CategoryService } from "../category/category.service";
import { SubcategoryDto } from "./dto/subcategory.dto";

@Injectable()
export class SubcategoryService {
    constructor(
        @InjectRepository(Subcategory)
        private subcategoryRepository: Repository<Subcategory>,
        private categoryService: CategoryService,
    ) { }

    async create(subcategoryDto: SubcategoryDto): Promise<Subcategory | null> {
        const category = await this.categoryService.findOneByName(subcategoryDto.categoryName);
        if (!category) {
            throw new Error(`Category ${subcategoryDto.categoryName} not found`);
        }

        const subcategory = this.subcategoryRepository.create({
            name: subcategoryDto.name,
            description: subcategoryDto.description,
            category,
        });

        return this.subcategoryRepository.save(subcategory);
    }
}