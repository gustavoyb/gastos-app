# Sistema de Gestión de Gastos

Sistema backend desarrollado con NestJS para la gestión de gastos personales o empresariales. Permite gestionar usuarios, cuentas, categorías, subcategorías y transacciones con un sistema completo de autenticación y autorización.

## 🚀 Características Principales

- 🔐 Autenticación JWT y control de roles
- 👥 Gestión de usuarios
- 💰 Gestión de cuentas y saldos
- 📊 Categorización de gastos e ingresos
- 📈 Reportes y resúmenes financieros
- 🔄 Transacciones recurrentes
- 🏷️ Sistema de etiquetas
- 📱 API RESTful

## 🛠️ Tecnologías

- NestJS 11
- TypeScript
- PostgreSQL
- TypeORM
- JWT para autenticación
- Jest (Testing)
- ESLint + Prettier
- Joi para validación

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
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=gastos_db

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura

# Entorno
NODE_ENV=development
PORT=3000
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
│   ├── auth/      # Autenticación y autorización
│   ├── category/  # Gestión de categorías
│   ├── category-type/ # Tipos de categorías
│   ├── subcategory/   # Subcategorías
│   ├── transaction/   # Gestión de transacciones
│   └── user/      # Gestión de usuarios
├── scripts/       # Scripts de utilidad
└── main.ts        # Punto de entrada de la aplicación
```

## 📝 API Endpoints

### Autenticación
- `POST /users/login` - Iniciar sesión
- `POST /users` - Registrar nuevo usuario

### Usuarios
- `GET /users/profile` - Obtener perfil del usuario actual
- `GET /users/:id` - Obtener usuario por ID
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Cuentas
- `POST /accounts` - Crear cuenta
- `GET /accounts` - Listar cuentas
- `GET /accounts/:id` - Obtener cuenta por ID
- `PATCH /accounts/:id` - Actualizar cuenta
- `DELETE /accounts/:id` - Eliminar cuenta

### Categorías
- `POST /categories` - Crear categoría
- `GET /categories` - Listar categorías
- `GET /categories/:id` - Obtener categoría por ID
- `PATCH /categories/:id` - Actualizar categoría
- `DELETE /categories/:id` - Eliminar categoría

### Subcategorías
- `POST /subcategories` - Crear subcategoría
- `GET /subcategories` - Listar subcategorías
- `GET /subcategories/:id` - Obtener subcategoría por ID
- `PATCH /subcategories/:id` - Actualizar subcategoría
- `DELETE /subcategories/:id` - Eliminar subcategoría

### Transacciones
- `POST /transactions` - Crear transacción
- `GET /transactions` - Listar transacciones (con filtros)
- `GET /transactions/:id` - Obtener transacción por ID
- `PATCH /transactions/:id` - Actualizar transacción
- `DELETE /transactions/:id` - Eliminar transacción
- `GET /transactions/summary/category` - Resumen por categoría
- `GET /transactions/summary/monthly` - Resumen mensual

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

## 🔒 Seguridad

- Autenticación mediante JWT
- Control de acceso basado en roles
- Validación de datos con class-validator
- Protección contra inyección SQL
- Sanitización de entradas
- Variables de entorno para datos sensibles

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y no está licenciado para uso público.
