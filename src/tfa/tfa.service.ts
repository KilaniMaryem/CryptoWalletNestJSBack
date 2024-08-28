import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';


@Injectable()
export class TfaService {

  private userObject = {
    publicAddress: null,
    tfa: null,
  };
  /*-------------------------------------------------------------------------------------------------------*/
  generateTfaSecret(publicAddress: string) {
    if (!publicAddress) {
      throw new Error('Public address is required to generate TFA secret.');
    }

    const secret = speakeasy.generateSecret({
      length: 10,
      name: publicAddress,
      issuer: 'NarenAuth v0.0',
    });

    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: publicAddress,
      issuer: 'NarenAuth v0.0',
      encoding: 'base32',
    });

    return { secret, url };
  }
  /*-------------------------------------------------------------------------------------------------------*/
  async generateQrCode(url: string): Promise<string> {
    return await QRCode.toDataURL(url);
  }
  /*-------------------------------------------------------------------------------------------------------*/
  async setupTfa(publicAddress: string) {
    if (!publicAddress) {
      throw new Error('Public address is required for TFA setup.');
    }

    const { secret, url } = this.generateTfaSecret(publicAddress);

    this.userObject = {
      publicAddress: publicAddress,
      tfa: {
        secret: '',
        tempSecret: secret.base32,
        dataURL: await this.generateQrCode(url),
        tfaURL: url,
      },
    };

    return {
      message: 'TFA Auth needs to be verified',
      tempSecret: secret.base32,
      qrCodeUrl: this.userObject.tfa.dataURL,
      tfaURL: url,
    };
  }
/*-------------------------------------------------------------------------------------------------------*/
  fetchTfaSetup(publicAddress: string) {
    return this.userObject.publicAddress === publicAddress ? this.userObject.tfa : null;
  }
 /*-------------------------------------------------------------------------------------------------------*/
  deleteTfaSetup(publicAddress: string) {
    if (this.userObject.publicAddress === publicAddress) {
      this.userObject.tfa = null;
      this.userObject.publicAddress = null;
      return { status: 200, message: 'success' };
    }
    return { status: 404, message: 'No TFA setup found for this address.' };
  }
  /*-------------------------------------------------------------------------------------------------------*/
  verifyTfa(publicAddress: string, token: string, setupMode: string, secretParam: string) {
    if (setupMode == "create") {

      const isVerified = speakeasy.totp.verify({
        secret: this.userObject.tfa.tempSecret,
        encoding: 'base32',
        token,
      });

      if (isVerified) {
        const { secret } = this.generateTfaSecret(publicAddress);
        return { status: 200, message: 'Two-factor Auth is enabled successfully', tfaSecret: secret.base32 };
      } else {
        return {
          status: 403,
          message: 'Invalid Auth Code, verification failed.',
        };
      }
    } else {
      const isVerified = speakeasy.totp.verify({
        secret: secretParam,
        encoding: 'base32',
        token,
      });
      if (isVerified) {
        return { status: 200, message: 'Successful access', tfaSecret: secretParam };
      } else {
        return {
          status: 403,
          message: 'Invalid Auth Code, verification failed.',
        };
      }

    }

  }

}