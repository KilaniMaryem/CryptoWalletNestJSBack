import { Controller, Post, Body, Get, Param, NotFoundException, Put,Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add')
  async addUser(
    @Body('publicAddress') publicAddress: string,
    @Body('emailAddress') emailAddress: string,
    @Body('SeedPhrase') SeedPhrase: string,
    @Body('tfaSecret') tfaSecret: string,
    @Body('publicKey') publicKey: string,
    @Body('privateKey') privateKey: string,
    @Body('blockedAddresses') blockedAddresses: Record<string, string>,
  ) {
    const userData = { publicAddress, emailAddress, SeedPhrase, tfaSecret, publicKey, privateKey, blockedAddresses };
    await this.userService.createUser(userData);
    return { message: 'User created successfully' };
  }
  /*-------------------------------------------------------------------------------------------------------*/
  @Get('get/:publicAddress')
  async getUserByPublicAddress(@Param('publicAddress') publicAddress: string): Promise<User> {
    try {
      return await this.userService.getUserByPublicAddress(publicAddress);
    } catch (error) {
      
      return null
    }
  }
  /*-------------------------------------------------------------------------------------------------------*/
  @Get('get-blocked-addresses/:publicAddress')
  async getBlockedAddresses(
    @Param('publicAddress') publicAddress: string,
  ): Promise<Record<string, string>> {
    try {
      const user = await this.userService.getUserByPublicAddress(publicAddress);
      const blockedAddresses = user.blockedAddresses;
      if (!blockedAddresses) {
        return {};
      }

      return blockedAddresses; 
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  /*-------------------------------------------------------------------------------------------------------*/
  @Put('update-email/:publicAddress')
  async updateUserEmailAddress(
    @Param('publicAddress') publicAddress: string,
    @Body('emailAddress') emailAddress: string,
  ): Promise<void> {
    try {
      await this.userService.updateUserEmailAddress(publicAddress, emailAddress);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  /*-------------------------------------------------------------------------------------------------------*/
  @Put('update-blocked-address/:publicAddress')
  async updateUserWithBlockedAddress(
    @Param('publicAddress') publicAddress: string,
    @Body('addressToBlock') addressToBlock: string,
    @Body('note') note: string,
  ): Promise<void> {
    try {
      await this.userService.updateUserWithBlockedAddress(publicAddress, addressToBlock, note);
    } catch (error) {
    
      throw new NotFoundException(error.message);
    }
  }
  /*-------------------------------------------------------------------------------------------------------*/
  @Post('update-secret')
  async updateSecret(
    @Body() body: { publicAddress: string; tfaSecret: string },
  ): Promise<void> {
    const { publicAddress, tfaSecret } = body;
    await this.userService.updateTfaSecret(publicAddress, tfaSecret);
  }
  /*-------------------------------------------------------------------------------------------------------*/
  @Put('update-tfa-enabled/:publicAddress')
  async updateTfaEnabled(
    @Param('publicAddress') publicAddress: string,
    @Body('tfaEnabled') tfaEnabled: boolean,
  ): Promise<void> {
    try {
      await this.userService.updateTfaEnabled(publicAddress, tfaEnabled);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  /*-------------------------------------------------------------------------------------------------------*/
  @Delete(':publicAddress/:addressToUnblock')
  async unblockAddress(
    @Param('publicAddress') publicAddress: string,
    @Param('addressToUnblock') addressToUnblock: string
  ): Promise<void> {
    try {
      await this.userService.unblockAddress(publicAddress, addressToUnblock);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`User with address ${publicAddress} or address ${addressToUnblock} not found.`);
      }
      throw error;
    }
  }
  
}

