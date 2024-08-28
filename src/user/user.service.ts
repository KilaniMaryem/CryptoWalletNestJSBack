import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(userData: { publicAddress: string; emailAddress: string; SeedPhrase: string; tfaSecret: string; publicKey: string; privateKey: string; blockedAddresses: Record<string, string> }): Promise<void> {
    const user = new User();
    user.publicAddress = userData.publicAddress;
    user.emailAddress = userData.emailAddress;
    user.SeedPhrase = userData.SeedPhrase;
    user.tfaSecret = userData.tfaSecret;  
    user.publicKey = userData.publicKey;
    user.privateKey = userData.privateKey;

    user.blockedAddresses = userData.blockedAddresses;

    await this.userRepository.save(user);
  }

  async getUserByPublicAddress(publicAddress: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { publicAddress: publicAddress },
    });
   
    if (!user) {
      throw new NotFoundException(`User with address ${publicAddress} not found.`);
    }

    

    return user;
  }

  async updateUserEmailAddress(publicAddress: string, emailAddress: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { publicAddress: publicAddress },
    });

    if (!user) {
      throw new NotFoundException(`User with address ${publicAddress} not found.`);
    }

    user.emailAddress = emailAddress;
    await this.userRepository.save(user);
  }
  
  async updateTfaSecret(publicAddress: string, tfaSecret: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { publicAddress } });
    if (user) {
      user.tfaSecret = tfaSecret;
      await this.userRepository.save(user);
    } else {
      throw new Error('User not found');
    }
  }

  async updateUserWithBlockedAddress(publicAddress: string, addressToBlock: string, note: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { publicAddress: publicAddress },
    });
   

    if (!user) {
      throw new NotFoundException(`User with address ${publicAddress} not found.`);
    }

    if ((user) && (!user.blockedAddresses)) {
      user.blockedAddresses = {};
    }
    user.blockedAddresses = { ...user.blockedAddresses, [addressToBlock]: note };
    //user.blockedAddresses[addressToBlock] = note; // Add address with note

    await this.userRepository.save(user);
  }

  async updateTfaEnabled(publicAddress: string, tfaEnabled: boolean): Promise<void> {
    const user = await this.userRepository.findOne({ where: { publicAddress } });
    if (user) {
      user.tfaEnabled = tfaEnabled;
      await this.userRepository.save(user);
    } else {
      throw new Error('User not found');
    }
  }



  async unblockAddress(publicAddress: string, addressToUnblock: string): Promise<void> {

  
    const user = await this.userRepository.findOne({
      where: { publicAddress },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (!user.blockedAddresses) {
      user.blockedAddresses = {};
    }
     

    if (user.blockedAddresses && user.blockedAddresses.hasOwnProperty(addressToUnblock)) {
      
    
      delete user.blockedAddresses[addressToUnblock];
  
    
      await this.userRepository.save(user);
    } else {
      console.log("Address not found in blockedAddresses:", addressToUnblock);
    }
      
      
    }
  }
  

