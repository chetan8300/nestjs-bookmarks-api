import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  signin() {
    return {
      message: "signin"
    }
  }

  signup() {
    return {
      message: "signup"
    }
  }
}