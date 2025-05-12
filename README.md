# Sistema de Gestión de Gastos

Este es un sistema backend desarrollado con NestJS para la gestión de gastos personales o empresariales. El sistema permite gestionar usuarios, cuentas, categorías, subcategorías y transacciones.

## 🚀 Tecnologías

- NestJS 11
- TypeScript
- PostgreSQL
- TypeORM
- Jest (Testing)
- ESLint + Prettier

## 📋 Prerrequisitos

- Node.js (versión recomendada: 18 o superior)
- PostgreSQL
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd gastos
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=tu_usuario
DATABASE_PASSWORD=tu_contraseña
DATABASE_NAME=gastos_db
```

4. Ejecutar migraciones:
```bash
npm run migration:run
```

5. (Opcional) Ejecutar seed de categorías:
```bash
npm run seed
```

## 🚀 Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

## 📁 Estructura del Proyecto

```
src/
├── config/         # Configuraciones de la aplicación
├── database/       # Configuración de la base de datos
├── enum/          # Enumeraciones
├── modules/       # Módulos de la aplicación
│   ├── account/   # Gestión de cuentas
│   ├── category/  # Gestión de categorías
│   ├── category-type/ # Tipos de categorías
│   ├── subcategory/   # Subcategorías
│   ├── transaction/   # Gestión de transacciones
│   └── user/      # Gestión de usuarios
├── scripts/       # Scripts de utilidad
└── main.ts        # Punto de entrada de la aplicación
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests con coverage
npm run test:cov

# Ejecutar tests e2e
npm run test:e2e
```

## 📝 Scripts Disponibles

- `npm run build`: Compila el proyecto
- `npm run start`: Inicia la aplicación
- `npm run start:dev`: Inicia la aplicación en modo desarrollo con hot-reload
- `npm run start:debug`: Inicia la aplicación en modo debug
- `npm run start:prod`: Inicia la aplicación en modo producción
- `npm run lint`: Ejecuta el linter
- `npm run test`: Ejecuta los tests
- `npm run migration:generate`: Genera nuevas migraciones
- `npm run migration:run`: Ejecuta las migraciones pendientes
- `npm run migration:revert`: Revierte la última migración
- `npm run seed`: Ejecuta el seed de categorías

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y no está licenciado para uso público.
