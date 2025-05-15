import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { UserDataSeeder } from "src/database/seeders/user-data.seeder";

async function bootstrap() {
    const logger = new Logger('Seed');

    logger.log('Starting the user data seeding process...');

    const app = await NestFactory.createApplicationContext(AppModule);

    try {
        const seeder = app.get(UserDataSeeder);
        await seeder.seed();
        logger.log('User data seeding completed successfully!');
    } catch (error) {
        logger.error('User data seeding failed!');
        logger.error(error);
    } finally {
        await app.close();
    }
}

bootstrap(); 