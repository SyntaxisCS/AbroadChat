// Postgres
import pgPool from "pg-pool";

// DB Setup
const Pool = new pgPool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_DB,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 1000,
    maxUses: 4500,
    max: 5
});

export const makeDBQuery = async (query) => {
    try {
        if (!query) return null;
        
        // get client from pool
        const client = await Pool.connect();

        // perform query
        const result = await client.query(query);

        // release client
        client.release();

        return result;

    } catch (err) {
        throw err;
    }
};