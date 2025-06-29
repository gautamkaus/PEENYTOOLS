require('dotenv').config();

module.exports = {
  db: {
    host: process.env.DB_HOST || '93.127.206.203',
    user: process.env.DB_USER || 'ptadmin',
    password: process.env.DB_PASSWORD || 'iE6IApsCDfNsVAdurDdK',
    database: process.env.DB_NAME || 'peenytoolsdb',
    port: process.env.DB_PORT || 3306,
  },
  jwtSecret: process.env.JWT_SECRET || 'pennytools-ai-shopfront-secure-jwt-secret-key-2024',
}; 