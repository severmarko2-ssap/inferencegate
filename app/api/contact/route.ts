// app/api/contact/route.ts
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // bitno: nodemailer ne radi na edge runtimu

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const email = String(body?.email || "").trim();
    const company = String(body?.company || "").trim();
    const spend = String(body?.spend || "").trim();
    const message = String(body?.message || "").trim();
    const source = String(body?.source || "").trim();

    if (!email || !company || !spend || !message) {
      return json({ ok: false, error: "Missing required fields." }, 400);
    }
    if (!isEmail(email)) {
      return json({ ok: false, error: "Invalid email." }, 400);
    }
    if (message.length < 3) {
      return json({ ok: false, error: "Message too short." }, 400);
    }

    // SMTP config (stavi u .env.local)
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // kamo šalješ
    const to = process.env.CONTACT_TO || "marko@ssap.io";
    const from = process.env.CONTACT_FROM || user || "no-reply@ssap.io";

    if (!host || !user || !pass) {
      return json(
        {
          ok: false,
          error:
            "Server is not configured (missing SMTP_HOST/SMTP_USER/SMTP_PASS).",
        },
        500
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const subject = `InferenceGate contact • ${company} • ${spend}/mo`;

    const text = [
      "New contact form submission",
      "",
      `Email: ${email}`,
      `Company: ${company}`,
      `Approx monthly LLM spend: ${spend}`,
      source ? `Source: ${source}` : "",
      "",
      "Message:",
      message,
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

    return json({ ok: true });
  } catch (err: any) {
    return json(
      { ok: false, error: "Unexpected server error.", detail: String(err?.message || err) },
      500
    );
  }
}
