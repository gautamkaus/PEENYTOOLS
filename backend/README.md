# PennyTools Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the backend directory:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=pennytools
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret
   ```

3. Create the MySQL database:
   ```sql
   CREATE DATABASE pennytools;
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```

## Endpoints
- `POST /api/register` — Register user
- `POST /api/login` — Login user
- `GET /api/products` — List products
- `POST /api/products` — Add product (admin)
- `PUT /api/products/:id` — Update product (admin)
- `DELETE /api/products/:id` — Delete product (admin)
- `POST /api/orders` — Place order
- `GET /api/orders` — List all orders (admin) 