import nodemailer, { Transporter } from "nodemailer";
import { inject, injectable } from "tsyringe";

import IMailProvider from "../models/IMailProvider";
import ISendMailDTO from "../dtos/ISendMailDTO";
import IMailTemplateProvider from "../../MailTemplateProvider/models/IMailTemplateProvider";

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject("MailTemplateProvider")
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    nodemailer.createTestAccount((err, account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      to: {
        name: to.name,
        address: to.address,
      },
      from: {
        name: from?.name || "Equipe GoBarber",
        address: from?.address || "equipe@gobarber.com.br",
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export default EtherealMailProvider;
