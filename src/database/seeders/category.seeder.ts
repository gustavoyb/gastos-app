import { Injectable, Logger } from "@nestjs/common";
import { CategoryTypeEnum } from "src/enum/category-type.enum";
import { CategoryTypeService } from "src/modules/category-type/category-type.service";
import { CategoryTypeDto } from "src/modules/category-type/dto/category-type.dto";
import { CategoryService } from "src/modules/category/category.service";
import { CategoryDto } from "src/modules/category/dto/category.dto";
import { SubcategoryDto } from "src/modules/subcategory/dto/subcategory.dto";
import { SubcategoryService } from "src/modules/subcategory/subcategory.service";

@Injectable()
export class CategorySeeder {
    private readonly logger = new Logger(CategorySeeder.name);

    constructor(
        private readonly categoryTypeService: CategoryTypeService,
        private readonly categoryService: CategoryService,
        private readonly subcategoryService: SubcategoryService,
    ) { }

    async seed() {
        this.logger.log('Starting database seeding...');

        await this.seedCategoryTypes();

        await this.seedCategories();

        await this.seedSubcategories();

        this.logger.log('Database seeding completed successfully!');
    }

    private async seedCategoryTypes() {
        const categoryTypes: CategoryTypeDto[] = [
            { name: CategoryTypeEnum.GASTO, description: 'Salidas de dinero' },
            { name: CategoryTypeEnum.INGRESO, description: 'Entradas de dinero' },
        ];

        for (const categoryType of categoryTypes) {
            const existing = await this.categoryTypeService.findOneByName(categoryType.name);
            if (!existing) {
                await this.categoryTypeService.create(categoryType);
                this.logger.debug(`Created category type: ${categoryType.name}`);
            } else {
                this.logger.debug(`Category type already exists: ${categoryType.name}`);
            }
        }
    }

    private async seedCategories() {
        // Categorías de GASTOS
        const expenseCategories: Omit<CategoryDto, 'typeName'>[] = [
            { name: 'Vivienda', description: 'Gastos relacionados con el hogar y la vivienda', icon: 'home', color: '#4A90E2' },
            { name: 'Alimentación', description: 'Gastos relacionados con comida y bebida', icon: 'restaurant', color: '#50E3C2' },
            { name: 'Transporte', description: 'Gastos de movilidad y transporte', icon: 'car', color: '#F5A623' },
            { name: 'Salud', description: 'Gastos médicos y de cuidado personal', icon: 'medical', color: '#D0021B' },
            { name: 'Educación', description: 'Gastos educativos y de formación', icon: 'school', color: '#9013FE' },
            { name: 'Entretenimiento', description: 'Gastos de ocio y actividades recreativas', icon: 'ticket', color: '#7ED321' },
            { name: 'Compras personales', description: 'Ropa, tecnología y artículos personales', icon: 'shopping', color: '#F8E71C' },
            { name: 'Servicios financieros', description: 'Comisiones e intereses bancarios', icon: 'bank', color: '#4A4A4A' },
            { name: 'Impuestos', description: 'Impuestos y tasas', icon: 'document', color: '#9B9B9B' },
            { name: 'Mascotas', description: 'Gastos relacionados con mascotas', icon: 'pets', color: '#8B572A' },
            { name: 'Gastos profesionales', description: 'Gastos relacionados con el trabajo', icon: 'briefcase', color: '#000000' },
            { name: 'Varios', description: 'Otros gastos varios y misceláneos', icon: 'more', color: '#B8E986' },
        ];

        // Categorías de INGRESOS
        const incomeCategories: Omit<CategoryDto, 'typeName'>[] = [
            { name: 'Ingresos laborales', description: 'Ingresos por trabajo en relación de dependencia', icon: 'work', color: '#4CAF50' },
            { name: 'Ingresos por trabajo independiente', description: 'Ingresos por actividades freelance', icon: 'laptop', color: '#2196F3' },
            { name: 'Inversiones', description: 'Rendimientos de inversiones financieras', icon: 'trending_up', color: '#FFC107' },
            { name: 'Ingresos por propiedades', description: 'Ingresos por alquileres o propiedades', icon: 'apartment', color: '#9C27B0' },
            { name: 'Ingresos extraordinarios', description: 'Ingresos no habituales', icon: 'star', color: '#FF9800' },
            { name: 'Ingresos pasivos', description: 'Ingresos recurrentes con poco esfuerzo', icon: 'attach_money', color: '#607D8B' },
            { name: 'Préstamos y financiación', description: 'Dinero recibido por préstamos', icon: 'account_balance', color: '#795548' },
            { name: 'Jubilaciones y pensiones', description: 'Ingresos por jubilación o pensión', icon: 'elderly', color: '#8BC34A' },
            { name: 'Transferencias', description: 'Transferencias recibidas de familiares u otros', icon: 'swap_horiz', color: '#FF5722' },
        ];

        // Crear categorías de gastos
        for (const category of expenseCategories) {
            const existing = await this.categoryService.findOneByName(category.name);
            if (!existing) {
                await this.categoryService.create({
                    ...category,
                    typeName: CategoryTypeEnum.GASTO,
                });
                this.logger.debug(`Created expense category: ${category.name}`);
            } else {
                this.logger.debug(`Expense category already exists: ${category.name}`);
            }
        }

        // Crear categorías de ingresos
        for (const category of incomeCategories) {
            const existing = await this.categoryService.findOneByName(category.name);
            if (!existing) {
                await this.categoryService.create({
                    ...category,
                    typeName: CategoryTypeEnum.INGRESO,
                });
                this.logger.debug(`Created income category: ${category.name}`);
            } else {
                this.logger.debug(`Income category already exists: ${category.name}`);
            }
        }
    }

    private async seedSubcategories() {
        // Subcategorías para VIVIENDA
        const housingSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Alquiler/Hipoteca', description: 'Pago mensual de alquiler o hipoteca' },
            { name: 'Expensas/Gastos comunes', description: 'Gastos comunes del edificio' },
            { name: 'Servicios', description: 'Luz, agua, gas' },
            { name: 'Internet y Cable', description: 'Servicio de internet y televisión' },
            { name: 'Telefonía fija', description: 'Servicio de teléfono fijo' },
            { name: 'Mantenimiento y reparaciones', description: 'Arreglos y mantenimiento del hogar' },
            { name: 'Mobiliario y decoración', description: 'Compra de muebles y artículos de decoración' },
            { name: 'Seguros del hogar', description: 'Seguro de vivienda' },
        ];

        for (const subcategory of housingSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Vivienda'
            });
        }

        // Subcategorías para ALIMENTACIÓN
        const foodSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Supermercado', description: 'Compras generales en supermercados' },
            { name: 'Verdulería/Frutería', description: 'Compras en verdulerías' },
            { name: 'Carnicería/Pescadería', description: 'Compras de carnes y pescados' },
            { name: 'Panadería', description: 'Compras en panaderías' },
            { name: 'Comidas fuera de casa', description: 'Restaurantes y bares' },
            { name: 'Delivery/Comida a domicilio', description: 'Pedidos a domicilio' },
            { name: 'Cafeterías', description: 'Gastos en cafeterías' },
            { name: 'Bebidas alcohólicas', description: 'Compras de bebidas alcohólicas' },
        ];

        for (const subcategory of foodSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Alimentación'
            });
        }

        // Subcategorías para TRANSPORTE
        const transportationSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Combustible', description: 'Compras de combustible para el vehículo' },
            { name: 'Transporte público (Colectivo, Subte, Tren)', description: 'Gastos en transporte público' },
            { name: 'Taxis/Remises/Apps de transporte (Uber, Cabify)', description: 'Gastos en taxis y aplicaciones de transporte' },
            { name: 'Estacionamiento', description: 'Gastos en estacionamientos' },
            { name: 'Peajes', description: 'Pago de peajes durante viajes en auto' },
            { name: 'Mantenimiento del vehículo', description: 'Gastos en reparación y mantenimiento del auto' },
            { name: 'Seguro del auto', description: 'Pago del seguro vehicular' },
            { name: 'Patente/Impuestos vehiculares', description: 'Pago de impuestos y patente del vehículo' },
        ];

        for (const subcategory of transportationSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Transporte'
            });
        }

        // Subcategorías para SALUD
        const healthSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Obra social/Prepaga', description: 'Pago de obra social o prepaga' },
            { name: 'Consultas médicas', description: 'Gastos en consultas con médicos' },
            { name: 'Medicamentos', description: 'Compra de medicamentos' },
            { name: 'Análisis y estudios', description: 'Gastos en análisis y estudios médicos' },
            { name: 'Tratamientos dentales', description: 'Gastos en tratamientos dentales' },
            { name: 'Tratamientos especializados', description: 'Tratamientos médicos especializados' },
            { name: 'Gimnasio/Actividades físicas', description: 'Gastos en gimnasio y actividades físicas' },
            { name: 'Productos de cuidado personal', description: 'Compra de productos de cuidado personal' },
        ];

        for (const subcategory of healthSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Salud'
            });
        }

        // Subcategorías para EDUCACIÓN
        const educationSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Matrícula/Cuotas escolares', description: 'Pago de matrícula y cuotas escolares' },
            { name: 'Materiales educativos', description: 'Compra de materiales educativos' },
            { name: 'Libros', description: 'Compra de libros' },
            { name: 'Cursos y capacitaciones', description: 'Gastos en cursos y capacitaciones' },
            { name: 'Clases particulares', description: 'Pago de clases particulares' },
            { name: 'Software educativo', description: 'Compra de software educativo' },
        ];

        for (const subcategory of educationSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Educación'
            });
        }

        // Subcategorías para ENTRETENIMIENTO
        const entertainmentSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Streaming (Netflix, Disney+, etc.)', description: 'Gastos en servicios de streaming' },
            { name: 'Cine/Teatro', description: 'Gastos en cine y teatro' },
            { name: 'Conciertos/Eventos', description: 'Gastos en conciertos y eventos' },
            { name: 'Salidas sociales', description: 'Gastos en salidas sociales y reuniones' },
            { name: 'Hobbies', description: 'Gastos en hobbies y actividades recreativas' },
            { name: 'Viajes y turismo', description: 'Gastos en viajes y turismo' },
            { name: 'Libros/Revistas/Diarios', description: 'Compra de libros, revistas y diarios' },
            { name: 'Videojuegos', description: 'Compra de videojuegos' },
        ];

        for (const subcategory of entertainmentSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Entretenimiento'
            });
        }

        // Subcategorías para COMPRAS PERSONALES
        const personalShoppingSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Ropa y calzado', description: 'Compra de ropa y calzado' },
            { name: 'Tecnología/Electrónica', description: 'Compra de tecnología y electrónica' },
            { name: 'Accesorios personales', description: 'Compra de accesorios personales' },
            { name: 'Artículos deportivos', description: 'Compra de artículos deportivos' },
            { name: 'Cuidado personal y belleza', description: 'Productos de cuidado personal y belleza' },
        ];

        for (const subcategory of personalShoppingSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Compras personales'
            });
        }

        // Subcategorías para SERVICIOS FINANCIEROS
        const financialServicesSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Comisiones bancarias', description: 'Comisiones por servicios bancarios' },
            { name: 'Intereses de préstamos', description: 'Intereses de préstamos personales o hipotecarios' },
            { name: 'Intereses de tarjetas de crédito', description: 'Intereses generados por tarjetas de crédito' },
            { name: 'Seguros (vida, accidentes)', description: 'Gastos en seguros de vida y accidentes' },
            { name: 'Asesoramiento financiero', description: 'Gastos en asesoramiento financiero' },
        ];

        for (const subcategory of financialServicesSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Servicios financieros'
            });
        }

        // Subcategorías para IMPUESTOS
        const taxesSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Impuesto a las ganancias', description: 'Pago de impuesto a las ganancias' },
            { name: 'Bienes personales', description: 'Pago de bienes personales' },
            { name: 'Impuestos municipales', description: 'Pago de impuestos municipales' },
            { name: 'Monotributo/Autónomos', description: 'Pago de monotributo o impuestos de autónomos' },
            { name: 'Otros impuestos', description: 'Otros tipos de impuestos' },
        ];

        for (const subcategory of taxesSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Impuestos'
            });
        }

        // Subcategorías para MASCOTAS
        const petsSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Alimentos', description: 'Compra de alimentos para mascotas' },
            { name: 'Veterinario', description: 'Gastos en veterinario' },
            { name: 'Productos de higiene', description: 'Productos de higiene para mascotas' },
            { name: 'Accesorios', description: 'Accesorios para mascotas' },
            { name: 'Guardería/Cuidado', description: 'Gastos en guardería o cuidado de mascotas' },
        ];

        for (const subcategory of petsSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Mascotas'
            });
        }

        // Subcategorías para GASTOS PROFESIONALES
        const professionalExpensesSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Material de oficina', description: 'Compra de material de oficina' },
            { name: 'Software/Herramientas profesionales', description: 'Gastos en software o herramientas profesionales' },
            { name: 'Suscripciones profesionales', description: 'Suscripciones a servicios profesionales' },
            { name: 'Networking', description: 'Gastos relacionados con networking profesional' },
        ];

        for (const subcategory of professionalExpensesSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Gastos profesionales'
            });
        }

        // Subcategorías para VARIOS/MISCELÁNEOS
        const miscellaneousSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Donaciones/Caridad', description: 'Gastos en donaciones y caridad' },
            { name: 'Regalos', description: 'Compra de regalos' },
            { name: 'Gastos imprevistos', description: 'Gastos imprevistos no clasificados' },
            { name: 'Multas', description: 'Pago de multas' },
            { name: 'Cuotas de membresías', description: 'Pago de cuotas de membresías a asociaciones o clubes' },
        ];

        for (const subcategory of miscellaneousSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Varios'
            });
        }

        // Subcategorías para INGRESOS LABORALES
        const laborIncomeSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Salario/Sueldo', description: 'Ingresos regulares por trabajo' },
            { name: 'Horas extras', description: 'Pagos por horas extras trabajadas' },
            { name: 'Bonificaciones/Premios', description: 'Bonos por rendimiento, etc.' },
            { name: 'Comisiones', description: 'Ingresos por comisiones de ventas' },
            { name: 'Aguinaldo', description: 'Sueldo anual complementario' },
            { name: 'Propinas', description: 'Ingresos por propinas' },
            { name: 'Reintegros laborales', description: 'Reembolsos de gastos laborales' },
        ];

        for (const subcategory of laborIncomeSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Ingresos laborales'
            });
        }

        // Subcategorías para INGRESOS POR TRABAJO INDEPENDIENTE
        const independentWorkIncomeSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Honorarios profesionales', description: 'Pago por servicios profesionales prestados' },
            { name: 'Facturación por servicios', description: 'Ingresos por la facturación de servicios' },
            { name: 'Ingresos por proyectos', description: 'Ingresos derivados de proyectos específicos' },
            { name: 'Consultoría', description: 'Ingresos por servicios de consultoría' },
            { name: 'Trabajos freelance', description: 'Ingresos por trabajos freelance o independientes' },
            { name: 'Ingresos por apps/plataformas (Uber, Airbnb, etc.)', description: 'Ingresos por plataformas de trabajo o alquileres' },
        ];

        for (const subcategory of independentWorkIncomeSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Ingresos por trabajo independiente'
            });
        }

        // Subcategorías para INVERSIONES
        const investmentIncomeSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Dividendos de acciones', description: 'Ingresos por dividendos de acciones' },
            { name: 'Intereses de plazos fijos', description: 'Ingresos por intereses de plazos fijos' },
            { name: 'Rentas de fondos de inversión', description: 'Ingresos generados por fondos de inversión' },
            { name: 'Ganancias de capital', description: 'Ingresos por ganancias de la venta de acciones o activos' },
            { name: 'Rendimiento de bonos', description: 'Ingresos por el rendimiento de bonos' },
            { name: 'Criptomonedas', description: 'Ingresos derivados de la compra y venta de criptomonedas' },
            { name: 'Utilidades de participación en empresas', description: 'Ingresos por participación en empresas o sociedades' },
        ];

        for (const subcategory of investmentIncomeSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Inversiones'
            });
        }

        // Subcategorías para INGRESOS POR PROPIEDADES
        const propertyIncomeSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Alquileres', description: 'Ingresos por alquiler de propiedades' },
            { name: 'Renta por temporada', description: 'Ingresos por alquileres de corto plazo (vacacionales)' },
            { name: 'Ingresos por venta de propiedades', description: 'Ganancias por venta de propiedades' },
        ];

        for (const subcategory of propertyIncomeSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Ingresos por propiedades'
            });
        }

        // Subcategorías para INGRESOS EXTRAORDINARIOS
        const extraordinaryIncomeSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Herencias', description: 'Ingresos recibidos por herencia' },
            { name: 'Premios/Loterías', description: 'Ingresos provenientes de premios o loterías' },
            { name: 'Indemnizaciones', description: 'Compensaciones por daños o pérdida de empleo' },
            { name: 'Regalos monetarios', description: 'Regalos en efectivo recibidos' },
            { name: 'Devolución de impuestos', description: 'Devoluciones fiscales recibidas' },
            { name: 'Subsidios gubernamentales', description: 'Ayudas económicas proporcionadas por el gobierno' },
        ];

        for (const subcategory of extraordinaryIncomeSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Ingresos extraordinarios'
            });
        }

        // Subcategorías para INGRESOS PASIVOS
        const passiveIncomeSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Regalías', description: 'Ingresos por derechos de autor, patentes, etc.' },
            { name: 'Ingresos por contenido digital', description: 'Ingresos generados por plataformas de contenido digital (YouTube, blogs)' },
            { name: 'Comisiones por afiliados', description: 'Ingresos por marketing de afiliados' },
            { name: 'Ingresos por licenciamiento', description: 'Ingresos por licencias de propiedad intelectual' },
        ];

        for (const subcategory of passiveIncomeSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Ingresos pasivos'
            });
        }

        // Subcategorías para PRÉSTAMOS Y FINANCIACIÓN
        const loansAndFinancingSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Préstamos personales', description: 'Ingresos por préstamos personales obtenidos' },
            { name: 'Préstamos bancarios', description: 'Ingresos por préstamos otorgados por bancos' },
            { name: 'Adelantos', description: 'Ingresos por adelantos o anticipos recibidos' },
            { name: 'Refinanciaciones', description: 'Ingresos provenientes de refinanciaciones de deuda' },
        ];

        for (const subcategory of loansAndFinancingSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Préstamos y financiación'
            });
        }

        // Subcategorías para JUBILACIONES Y PENSIONES
        const pensionsAndRetirementSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Jubilación', description: 'Ingreso mensual por jubilación' },
            { name: 'Pensión', description: 'Ingreso mensual por pensión' },
            { name: 'Rentas vitalicias', description: 'Ingresos generados por rentas vitalicias' },
            { name: 'Retiros programados de fondos de pensión', description: 'Ingresos por retiros programados de fondos de pensión' },
        ];

        for (const subcategory of pensionsAndRetirementSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Jubilaciones y pensiones'
            });
        }

        // Subcategorías para TRANSFERENCIAS
        const transferIncomeSubcategories: Omit<SubcategoryDto, 'categoryName'>[] = [
            { name: 'Cuota alimentaria recibida', description: 'Ingreso recibido como cuota alimentaria' },
            { name: 'Ayuda familiar recibida', description: 'Transferencias de ayuda familiar recibida' },
            { name: 'Transferencias entre cuentas propias', description: 'Transferencias de dinero entre cuentas del mismo titular' },
        ];

        for (const subcategory of transferIncomeSubcategories) {
            await this.createSubcategory({
                ...subcategory,
                categoryName: 'Transferencias'
            });
        }
    }

    private async createSubcategory(dto: SubcategoryDto): Promise<void> {
        try {
            await this.subcategoryService.create(dto);
            this.logger.debug(`Created subcategory: ${dto.name} for ${dto.categoryName}`);
        } catch (error) {
            this.logger.warn(`Failed to create subcategory ${dto.name}: ${error.message}`);
        }
    }
}