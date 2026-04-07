import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    await prisma.contactSubmission.create({
      data: { name, email, message },
    });

    const date = new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    await resend.emails.send({
      from: process.env.RESEND_DOMAIN
        ? `Portfolio Contact <noreply@${process.env.RESEND_DOMAIN}>`
        : "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:#18181b;padding:28px 36px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#71717a;font-weight:500;">Portfolio</p>
              <h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:#ffffff;line-height:1.3;">New message from your site</h1>
            </td>
          </tr>

          <!-- Sender info -->
          <tr>
            <td style="padding:28px 36px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:16px;border-bottom:1px solid #f4f4f5;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a1a1aa;font-weight:500;">From</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${name}</p>
                    <a href="mailto:${email}" style="font-size:13px;color:#22c55e;text-decoration:none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;padding-bottom:28px;">
                    <p style="margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a1a1aa;font-weight:500;">Message</p>
                    <div style="background:#fafafa;border-left:3px solid #22c55e;border-radius:0 6px 6px 0;padding:16px 20px;">
                      <p style="margin:0;font-size:14px;line-height:1.7;color:#3f3f46;white-space:pre-wrap;">${message}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reply CTA -->
          <tr>
            <td style="padding:0 36px 28px;">
              <a href="mailto:${email}?subject=Re: Your message&body=Hi ${name},%0A%0A"
                 style="display:inline-block;background:#22c55e;color:#ffffff;font-size:13px;font-weight:600;padding:10px 22px;border-radius:6px;text-decoration:none;letter-spacing:0.01em;">
                Reply to ${name}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;border-top:1px solid #f4f4f5;padding:16px 36px;">
              <p style="margin:0;font-size:11px;color:#a1a1aa;">Received ${date}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
