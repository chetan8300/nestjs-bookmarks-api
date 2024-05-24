import { ForbiddenException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signin(dto: AuthDto) {
    // Find the user by email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // If the user is not found, throw an error
    if (!user) throw new ForbiddenException("Invalid credentials");

    // Compare the password
    const isPasswordValid = await argon.verify(user.password, dto.password);

    // If the password is incorrect, throw an error
    if (!isPasswordValid) throw new ForbiddenException("Invalid credentials");

    delete user.password;

    // Return the user
    return user;
  }

  async signup(data: AuthDto) {
    // Hash the password
    const hashedPassword = await argon.hash(data.password);

    // Create a new user
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
        },
      });

      delete user.password;

      // Return the user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("Email is already taken");
        }
      }
    }
  }
}