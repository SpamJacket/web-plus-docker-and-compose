export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    name: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    autoLoadEntities: Boolean(process.env.POSTGRES_AUTO_LOAD_ENTITIES),
    synchronize:
      process.env.NODE_ENV === 'production'
        ? Boolean(process.env.SYNCHRONIZE_PROD)
        : Boolean(process.env.SYNCHRONIZE_DEV),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'not-very-secret',
    ttl:
      (process.env.NODE_ENV === 'production'
        ? process.env.JWT_TTL_PROD
        : process.env.JWT_TTL_DEV) || '900s',
  },
});
