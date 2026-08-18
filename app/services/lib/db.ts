// import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL as string)

// export default sql

import postgres from 'postgres'

// ВРЕМЕННО вставляем строку напрямую.
// Обязательно в кавычках!

// const connectionString =
//     'postgresql://u_cmsasza180:5R6Jn5gUttXG4FoDr5vG9LEnsGuTB@45.15.253.109:54328/db_doc_shev'
// const connectionString =
//     'postgresql://u_cmsasza180:5R6Jn5gUttXG4FoDr5vG9LEnsGuTB@db-team-cmsafbpei002jrw01oh3npkek:5432/db_doc_shev'

// const sql = postgres(connectionString)

export default sql
