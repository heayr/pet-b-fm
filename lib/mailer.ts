const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@radiotochka.nologs.site";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  // Если нет RESEND_API_KEY, используем console.log для разработки
  if (!RESEND_API_KEY || RESEND_API_KEY.startsWith("re_ваш")) {
    console.log(`[EMAIL DEV] To: ${to}, Subject: ${subject}`);
    console.log(`[EMAIL DEV] Body: ${html}`);
    return { success: true, devMode: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[RESEND ERROR]", err);
      return { success: false, error: err };
    }

    return { success: true };
  } catch (error) {
    console.error("[RESEND ERROR]", error);
    return { success: false, error: String(error) };
  }
}

export function generateVerificationEmail(
  name: string,
  token: string,
  appUrl: string
): string {
  const link = `${appUrl}/auth/verify-email?token=${token}`;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Подтверждение Email</h2>
      <p>Здравствуйте, ${name}!</p>
      <p>Для подтверждения вашего email перейдите по ссылке:</p>
      <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #1855FF; color: white; text-decoration: none; border-radius: 6px;">
        Подтвердить Email
      </a>
      <p style="margin-top: 20px; color: #666;">
        Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
      </p>
    </div>
  `;
}

export function generatePasswordResetEmail(
  name: string,
  token: string,
  appUrl: string
): string {
  const link = `${appUrl}/auth/reset-password?token=${token}`;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Сброс пароля</h2>
      <p>Здравствуйте, ${name}!</p>
      <p>Для сброса пароля перейдите по ссылке:</p>
      <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #1855FF; color: white; text-decoration: none; border-radius: 6px;">
        Сбросить пароль
      </a>
      <p style="margin-top: 20px; color: #666;">
        Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
        Ссылка действительна в течение 1 часа.
      </p>
    </div>
  `;
}