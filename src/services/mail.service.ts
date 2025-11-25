import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY, SENDGRID_FROM } from '../configs/index.js';
import { HttpException } from '../middlewares/httpException.js';

export class MailService {
    constructor() {
        sgMail.setApiKey(SENDGRID_API_KEY as string);
    }

    public async sendMail(to: string, subject: string, html: string): Promise<void> {
        const msg = {
            to,
            from: SENDGRID_FROM as string,
            subject,
            html
        };
        // await sgMail.send(msg)
        //     .then(() => console.log('Email sent'))
        //     .catch((error) => { throw new HttpException(500, `Failed to send email: ${error.message}`); });
    }
}