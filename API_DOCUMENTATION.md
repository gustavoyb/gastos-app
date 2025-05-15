# Documentación de la API de Gastos

## Base URL
```
http://localhost:3000
```

## Autenticación
La API utiliza JWT (JSON Web Tokens) para la autenticación. El token debe ser enviado en el header de todas las peticiones protegidas:

```
Authorization: Bearer <token>
```

## Endpoints

### Usuarios

#### Registro de Usuario
```http
POST /users
Content-Type: application/json

{
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "password": "string",
    "profile_image": "string (opcional)",
    "language_preference": "string (opcional)",
    "currency_preference": "string (opcional)"
}
```

#### Login
```http
POST /users/login
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}

Respuesta:
{
    "access_token": "string",
    "user": {
        "id": number,
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        // ... otros campos del usuario
    }
}
```

#### Obtener Perfil
```http
GET /users/profile
Authorization: Bearer <token>

Respuesta:
{
    "id": number,
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    // ... otros campos del usuario
}
```

### Cuentas

#### Crear Cuenta
```http
POST /accounts
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "string",
    "balance": number,
    "currency": "string",
    "type": "string",
    "description": "string (opcional)"
}
```

#### Obtener Todas las Cuentas
```http
GET /accounts
Authorization: Bearer <token>
```

#### Obtener Cuentas Activas
```http
GET /accounts/active
Authorization: Bearer <token>
```

#### Obtener Balance Total
```http
GET /accounts/balance
Authorization: Bearer <token>
```

#### Obtener Cuenta Específica
```http
GET /accounts/:id
Authorization: Bearer <token>
```

#### Actualizar Cuenta
```http
PATCH /accounts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "string (opcional)",
    "balance": number (opcional),
    "currency": "string (opcional)",
    "type": "string (opcional)",
    "description": "string (opcional)"
}
```

#### Activar Cuenta
```http
PATCH /accounts/:id/activate
Authorization: Bearer <token>
```

#### Desactivar Cuenta
```http
PATCH /accounts/:id/deactivate
Authorization: Bearer <token>
```

#### Eliminar Cuenta
```http
DELETE /accounts/:id
Authorization: Bearer <token>
```

### Transacciones

#### Crear Transacción
```http
POST /transactions
Authorization: Bearer <token>
Content-Type: application/json

{
    "amount": number,
    "description": "string",
    "date": "string (ISO date)",
    "category_id": number,
    "account_id": number,
    "type": "INCOME" | "EXPENSE"
}
```

#### Obtener Transacciones
```http
GET /transactions
Authorization: Bearer <token>

Query Parameters:
- start_date: string (ISO date)
- end_date: string (ISO date)
- type: "INCOME" | "EXPENSE"
- category_id: number
- account_id: number
```

#### Obtener Resumen por Categoría
```http
GET /transactions/summary/category
Authorization: Bearer <token>

Query Parameters:
- start_date: string (ISO date)
- end_date: string (ISO date)
- type: "INCOME" | "EXPENSE"
```

#### Obtener Resumen Mensual
```http
GET /transactions/summary/monthly
Authorization: Bearer <token>

Query Parameters:
- year: number
- type: "INCOME" | "EXPENSE"
```

#### Obtener Transacción Específica
```http
GET /transactions/:id
Authorization: Bearer <token>
```

#### Actualizar Transacción
```http
PATCH /transactions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "amount": number (opcional),
    "description": "string (opcional)",
    "date": "string (ISO date) (opcional)",
    "category_id": number (opcional),
    "account_id": number (opcional),
    "type": "INCOME" | "EXPENSE" (opcional)
}
```

#### Eliminar Transacción
```http
DELETE /transactions/:id
Authorization: Bearer <token>
```

## Códigos de Estado

- 200: OK
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Manejo de Errores

Los errores se devuelven en el siguiente formato:

```json
{
    "statusCode": number,
    "message": "string",
    "error": "string"
}
```

## Notas Importantes

1. Todas las rutas excepto `/users/login` y `/users` (registro) requieren autenticación.
2. Los tokens JWT expiran después de 1 hora.
3. Las fechas deben enviarse en formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ).
4. Los montos de dinero deben enviarse como números, no como strings.
5. Las transacciones pueden ser de tipo "INCOME" (ingreso) o "EXPENSE" (gasto). 