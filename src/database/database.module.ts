import { Module } from "@nestjs/common";
import { CategoryTypeModule } from "src/modules/category-type/category-type.module";
import { CategoryModule } from "src/modules/category/category.module";
import { SubcategoryModule } from "src/modules/subcategory/subcategory.module";
import { CategorySeeder } from "./seeders/category.seeder";

@Module({
    imports: [
        CategoryTypeModule,
        CategoryModule,
        SubcategoryModule,
    ],
    providers: [CategorySeeder],
    exports: [CategorySeeder],
})
export class DatabaseModule { }