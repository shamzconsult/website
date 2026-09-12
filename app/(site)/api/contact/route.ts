

import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  const { name, email, phone, address, website, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  try {
    await transporter.verify()
  } catch (verifyError) {
    console.error("SMTP connection failed:", verifyError)
    return NextResponse.json(
      { error: "Mail server connection failed. Check SMTP credentials." },
      { status: 500 }
    )
  }

  const mailOptions = {
    from: `"Enquiry from Website" <${process.env.SMTP_USER}>`,
    to: process.env.RECEIVER_EMAIL,
    replyTo: email,
    subject: `New Enquiry Message from ${name}`,
    html: `
      <h2>New Enquiry from website</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Name</strong></td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #ddd">${phone || "N/A"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Address</strong></td><td style="padding:8px;border:1px solid #ddd">${address || "N/A"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Website</strong></td><td style="padding:8px;border:1px solid #ddd">${website || "N/A"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Message</strong></td><td style="padding:8px;border:1px solid #ddd">${message}</td></tr>
      </table>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Mail send error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}