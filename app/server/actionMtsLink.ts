export async function dbSaveMtsLink(orderId: number, link: string) {
    await sql`UPDATE orders SET link = ${link} WHERE id = ${orderId}`
}
