# 📈 market-api

API de mercado construida con NestJS, que permite la gestión de órdenes de compra, venta, depósitos y retiros, así como el cálculo de posesiones y balances de usuarios.

## 🚀 Características

- Gestión de órdenes: `BUY`, `SELL`, `CASH_IN`, `CASH_OUT`
- Validación de órdenes mediante estrategias (`Strategy Pattern`)
- Cálculo de posesiones y balances disponibles
- Integración con repositorios de datos de mercado
- Arquitectura modular y escalable con NestJS
- Pruebas unitarias con Jest

## 🛠️ Tecnologías utilizadas

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [TypeORM](https://typeorm.io/) 
- [PostgreSQL](https://www.postgresql.org/) 

## 📦 Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/gucastillo-personal/marcket-api.git
   cd marcket-api
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno:

   Crea un archivo `.env` en la raíz del proyecto y agrega las variables necesarias. Por ejemplo:

   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=tu_usuario
   DATABASE_PASSWORD=tu_contraseña
   DATABASE_NAME=marcket_db
   ```

4. Ejecuta las migraciones (si aplican):

   ```bash
   npm run typeorm migration:run
   ```

## 🚀 Uso

Inicia la aplicación en modo desarrollo:

```bash
npm run build
npm run start:dev
```

La API estará disponible en `http://localhost:3000`.

## 🧪 Pruebas

Ejecuta las pruebas unitarias con Jest:

```bash
npm run test
```

Para ver la cobertura de pruebas:

```bash
npm run test:cov
```

## 📁 Estructura del proyecto

```
src/
├── application/
│   └── use-cases/
├── domain/
│   ├── business/
│   ├── entities/
│   ├── interfaces/
│   └── repositories/
├── infrastructure/
│   ├── controllers/
│   └── services/
├── shared/
└── main.ts
```

## 📌 Endpoints principales

- `POST /orders/create`: Crea una nueva orden
- `GET /orders/user/:userId`: Obtiene las órdenes de un usuario
- `GET /summary/assets`: Obtiene los activos actuales del usuario
- `GET /summary/balance`: Obtiene el balance disponible para invertir

## 🧑‍💻 Autor

- **Gustavo Castillo** - [GitHub](https://github.com/gucastillo-personal)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
