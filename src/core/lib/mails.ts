// lib/email.server.ts
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
  }>;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  filePath?: string;
  error?: Error;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isDevelopment: boolean;
  private emailLogsDir: string;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.emailLogsDir = path.join(process.cwd(), "email-logs");

    if (this.isDevelopment) {
      this.ensureLogsDirectory();
    } else {
      this.initializeTransporter();
    }
  }

  private async ensureLogsDirectory() {
    try {
      await fs.mkdir(this.emailLogsDir, { recursive: true });
    } catch (error) {
      console.error("Error creating email logs directory:", error);
    }
  }

  private initializeTransporter() {
    // Verificar que las variables de entorno necesarias existen
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      throw new Error("SMTP configuration is missing in environment variables");
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private async saveEmailToFile(options: EmailOptions): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `email-${timestamp}.json`;
    const filePath = path.join(this.emailLogsDir, filename);

    const emailData = {
      ...options,
      timestamp: new Date().toISOString(),
      environment: "development",
    };

    await fs.writeFile(filePath, JSON.stringify(emailData, null, 2));

    // También guardar una versión HTML para fácil visualización
    const htmlFilePath = path.join(
      this.emailLogsDir,
      `email-${timestamp}.html`,
    );
    if (options.html) {
      await fs.writeFile(htmlFilePath, options.html);
    }

    return filePath;
  }

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      // Configurar from por defecto si no se proporciona
      const defaultFrom = process.env.SMTP_FROM || "noreply@rifapp.com";
      const mailOptions = {
        from: options.from || defaultFrom,
        ...options,
      };

      // En desarrollo: guardar en archivo
      if (this.isDevelopment) {
        const filePath = await this.saveEmailToFile(mailOptions);
        console.log(`📧 Email saved to file: ${filePath}`);

        return {
          success: true,
          filePath,
          messageId: `dev-${Date.now()}`,
        };
      }

      // En producción: enviar realmente
      if (!this.transporter) this.initializeTransporter();

      const info = await this.transporter!.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return {
        success: false,
        error: error as Error,
      };
    }
  }

  // Método para verificar la configuración SMTP
  async verifyConnection(): Promise<boolean> {
    if (this.isDevelopment) return true; // En desarrollo siempre retorna true

    try {
      if (!this.transporter) {
        this.initializeTransporter();
      }
      await this.transporter!.verify();
      return true;
    } catch (error) {
      console.error("SMTP connection verification failed:", error);
      return false;
    }
  }

  // Método para obtener la lista de emails guardados (solo desarrollo)
  async getSavedEmails(): Promise<string[]> {
    if (!this.isDevelopment) return [];

    try {
      const files = await fs.readdir(this.emailLogsDir);
      return files
        .filter((file) => file.endsWith(".json"))
        .sort()
        .reverse();
    } catch (error) {
      console.error("Error reading email logs:", error);
      return [];
    }
  }

  // Método para leer un email guardado (solo desarrollo)
  async getSavedEmail(filename: string): Promise<EmailOptions | null> {
    if (!this.isDevelopment) {
      return null;
    }

    try {
      const filePath = path.join(this.emailLogsDir, filename);
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.error("Error reading email file:", error);
      return null;
    }
  }
}

// Exportar una instancia única del servicio
const emailService = new EmailService();
export default emailService;

// Exportar también una función helper para enviar emails
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  return emailService.sendEmail(options);
}
