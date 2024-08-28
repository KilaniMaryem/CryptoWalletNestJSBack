import { Controller, Post, Get, Delete, Body, Query, Res } from '@nestjs/common';
import { TfaService } from './tfa.service';

@Controller('tfa')
export class TfaController {
  constructor(private readonly tfaService: TfaService) {}
/*------------------------------------------------------------------------------------------------------------*/
  @Post('setup')
  async setupTfa(@Body('publicAddress') publicAddress: string, @Res() res) {
    try {
      const result = await this.tfaService.setupTfa(publicAddress);
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
/*------------------------------------------------------------------------------------------------------------*/
  @Get('setup')
  fetchTfaSetup(@Query('publicAddress') publicAddress: string, @Res() res) {
    const result = this.tfaService.fetchTfaSetup(publicAddress);
    if (result) {
      return res.json(result);
    } else {
      return res.status(404).json({ message: 'No TFA setup found for this address.' });
    }
  }
/*------------------------------------------------------------------------------------------------------------*/
  @Delete('setup')
  deleteTfaSetup(@Query('publicAddress') publicAddress: string, @Res() res) {
    const result = this.tfaService.deleteTfaSetup(publicAddress);
    return res.status(result.status).json({ message: result.message });
  }
/*------------------------------------------------------------------------------------------------------------*/
  @Post('verify')
  async verifyTfa(@Body('publicAddress') publicAddress: string,
                  @Body('token') token: string,
                  @Body('setupMode') setupMode: string,
                  @Body('secret') secretParam: string, 
                  @Res() res) {
    try {
      
      const result = await this.tfaService.verifyTfa(publicAddress, token,setupMode,secretParam);
      return res.status(result.status).json({
        message: result.message,
        tfaSecret: result.tfaSecret  
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

 
}
