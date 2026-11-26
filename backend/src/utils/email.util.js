import nodemailer from "nodemailer";

// Configuración de transporte SMTP
const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Envío de correo de recuperación
const enviarCorreoRecuperacion = async ({ destinatario, nombre, resetLink }) => {
  const emailUser = process.env.EMAIL_USER;
  const transporter = getTransporter();

  const mailOptions = {
    from: `"ELECTRONOVA" <${emailUser}>`,
    to: destinatario,
    subject: "Recuperación de Contraseña - ELECTRONOVA",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #0f172a; margin: 0; font-size: 24px;">💡 ELECTRONOVA</h1>
          <p style="color: #64748b; margin-top: 5px; font-size: 14px;">Soluciones Eléctricas</p>
        </div>
        <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 12px;">Recuperación de Contraseña</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">Hola <strong>${nombre || "Estimado cliente"}</strong>,</p>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en ELECTRONOVA.</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #0d284a; color: #ffffff; padding: 13px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">Restablecer mi Contraseña</a>
        </p>
        <p style="color: #64748b; font-size: 13px;">⚠️ Por seguridad, este enlace es de un solo uso y expirará en <strong>15 minutos</strong>.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Si tú no solicitaste este cambio, puedes ignorar este mensaje tranquilamente. Tu cuenta sigue estando protegida.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

export { enviarCorreoRecuperacion };
