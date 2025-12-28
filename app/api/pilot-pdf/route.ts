// app/api/pilot-pdf/route.ts
import * as nodemailer from "nodemailer";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = String(body?.email || "").trim();

    if (!email || !isEmail(email)) {
      return json({ ok: false, error: "Please provide a valid email." }, 400);
    }

    // ----- optional: send lead email (keeps your existing behavior) -----
    const host = process.env.SMTP_HOST || "";
    const port = Number(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER || "";
    const pass = process.env.SMTP_PASS || "";
    const to = process.env.LEADS_TO || process.env.SMTP_TO || "marko@ssap.io";
    const from = process.env.SMTP_FROM || user || "marko@ssap.io";

    // grab basic request metadata (best-effort)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";
    const ua = req.headers.get("user-agent") || "";

    // Only try sending if SMTP config exists
    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      const subject = `PDF download lead • ${email}`;
      const text = [
        "New PDF download lead",
        "",
        `Email: ${email}`,
        `Time: ${new Date().toISOString()}`,
        ip ? `IP: ${ip}` : "",
        ua ? `User-Agent: ${ua}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      await transporter.sendMail({
        to,
        from,
        replyTo: email,
        subject,
        text,
      });
    }

    // ---------- return NEW SSAP PDF ----------
    const FILE_NAME = "SSAP-Technical-Overview.pdf";
    const PDF_PATH = path.join(
      process.cwd(),
      "public",
      "pdfs",
      FILE_NAME
    );

    const file = await fs.readFile(PDF_PATH);

    return new Response(file, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${FILE_NAME}"`,
        "cache-control": "no-store",
      },
    });
  } catch (err: any) {
    return json(
      {
        ok: false,
        error: "Unexpected server error.",
        detail: String(err?.message || err),
      },
      500
    );
  }
}
