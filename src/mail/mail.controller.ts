import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';




@Controller('email')
export class MailController {
  constructor(private readonly emailService: MailService) {}

  @Post('send')
  async sendEmail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('html') html: string,
  ) {
    await this.emailService.sendEmail(to, subject, html);
  }
}

