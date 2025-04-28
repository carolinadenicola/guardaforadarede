import sql from 'mssql'

// connection configs
const config = {
    user: process.env.NEXT_PUBLIC_DB_USER,
    password: process.env.NEXT_PUBLIC_DB_PASS,
    server: process.env.NEXT_PUBLIC_DB_HOST,
    database: 'CHECKLIST',
    options: {
        instancename: 'fabrica',
        trustedconnection: true,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 5000
      },
}

export default async function ExecuteQuery(query) {
    let pool
    try {
        pool = await sql.connect(config);
        let products = await pool.request().query(query);
        await pool.close();
        return products.recordset;
    }
    catch (error) {
        if (pool) {
            pool.close(); 
        }
    }
}
