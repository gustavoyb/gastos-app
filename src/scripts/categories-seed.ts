import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { CategorySeeder } from "src/database/seeders/category.seeder";

async function bootstrap() {
    const logger = new Logger('Seed');

    logger.log('Starting the categories seeding process...');

    const app = await NestFactory.createApplicationContext(AppModule);

    try {
        const seeder = app.get(CategorySeeder);
        await seeder.seed();
        logger.log('Categories seeding completed successfully!');
    } catch (error) {
        logger.error('Categories seeding failed!');
        logger.error(error);
    } finally {
        await app.close();
    }
}

bootstrap();