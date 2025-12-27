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

    // ---------- send lead email (Option A: inbox list) ----------
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    const to = process.env.PDF_LEAD_TO || "marko@ssap.io";
    const from = process.env.PDF_LEAD_FROM || user || "no-reply@ssap.io";

    const ua = req.headers.get("user-agent") || "";
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "";

    // Best-effort: if SMTP not configured, do NOT block download
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

    // ---------- return PDF download ----------
    const FILE_NAME = "inferencegate-pilot-pricing.pdf";
    const PDF_PATH = path.join(process.cwd(), "public", FILE_NAME);

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
