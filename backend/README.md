# PennyTools Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the backend directory:
   ```env
   DB_HOST=93.127.206.203
   DB_USER=peenytoolsadmin
   DB_PASSWORD=gSMWUo2pljhA4BSif1sF
   DB_NAME=peenytoolsdb
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret
   ```

3. The database `peenytoolsdb` should already exist on the remote server.

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