'use server'
import nodemailer from 'nodemailer'

export default async function sendEmail(
    to: string,
    subject: string,
    html: string,
    from: string,
    attachments: File[] = [],
): Promise<void> {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    const emailAttachments = await Promise.all(
        attachments.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer()
            return {
                filename: file.name,
                content: Buffer.from(arrayBuffer),
            }
        }),
    )

    await transporter.sendMail({
        from: `"${from}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        attachments: emailAttachments,
    })
}
