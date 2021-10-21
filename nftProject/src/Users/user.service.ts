import { Role } from '.prisma/client';
import { Injectable } from '@nestjs/common';


@Injectable()
export class UserService {
    createUser(name: string, email: string, blockchainaddress: string, role: Role): void {
        return;
    }
}