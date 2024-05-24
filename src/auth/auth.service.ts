import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  signin() {
    // Find the user by email

    // If the user is not found, throw an error
  }

  async signup(data: AuthDto) {
    // Hash the password
    const hashedPassword = await argon.hash(data.password);

    // Create a new user
    const user = await this.prismaService.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });

    delete user.password;

    // Return the user
    return user;
  }
}