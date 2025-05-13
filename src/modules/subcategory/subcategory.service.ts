import { Injectable, NotFoundException } from "@nestjs/common";
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

    async findOne(id: number): Promise<Subcategory> {
        const user = await this.subcategoryRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Subcategoría con ID ${id} no encontrado`);
        }
        return user;
    }
}