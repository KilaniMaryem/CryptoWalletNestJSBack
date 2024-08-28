import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TfaService } from './tfa/tfa.service';
import { TfaController } from './tfa/tfa.controller';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';


@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.mysql_host,
      port: parseInt(process.env.port, 10),
      username: process.env.mysql_username,
      password: process.env.mysql_pwd,
      database: process.env.mysql_db,
      entities: [User], 
      synchronize: false, 
    }),
    UserModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port:parseInt(process.env.SMTP_PORT, 10), 
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    }),

  ],
  controllers: [AppController, TfaController, MailController],
  providers: [AppService, TfaService, MailService],
})
export class AppModule {}
