// import postgres from 'postgres'
// const sql = postgres(process.env.DATABASE_URL as string)

// export default sql

//////////////////////////////////////////////////////////////////
// import postgres from 'postgres'

// const sql = postgres(process.env.DATABASE_URL as string, {
//     max: 5,
//     idle_timeout: 20,
//     connect_timeout: 10,
// })

// export default sql
/////////////////////////////////////
// с кэшем
import postgres from 'postgres'

declare global {
    // eslint-disable-next-line no-var
    var __postgresSqlClient__: ReturnType<typeof postgres> | undefined
}

const sql =
    global.__postgresSqlClient__ ?? postgres(process.env.DATABASE_URL as string)

if (process.env.NODE_ENV !== 'production') global.__postgresSqlClient__ = sql

export default sql
