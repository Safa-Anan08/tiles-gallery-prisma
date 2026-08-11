import prisma from "../../lib/prisma";
import { signAccessToken } from "../../lib/jwt";
import { comparePassword, hashPassword } from "../../lib/password";
import { AuthUser, UserRole } from "../../types/auth";
import { AppError } from "../../errors/appError";

export class AuthService {
  /**
   * Generates a signed JWT access token for a given user
   */
  static generateToken(user: { id: string; email: string; role: UserRole }): string {
    return signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
  }

  /**
   * Registers a new user with bcrypt password hash & JWT
   */
  static async registerUser(data: { name?: string; email: string; password: string }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw AppError.badRequest("User with this email already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name || null,
        email: data.email,
        passwordHash: hashedPassword,
        role: UserRole.USER,
        isDeleted: false,
      },
    });

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * Authenticates user via bcrypt password check (with Account fallback) & returns JWT
   */
  static async loginUser(data: { email: string; password: string }) {
    const user = await prisma.user.findFirst({
      where: { email: data.email, isDeleted: false },
      include: { accounts: true },
    });

    if (!user) {
      throw AppError.unauthorized("Invalid email or password");
    }

    let isValidPassword = false;

    // Check direct passwordHash on User model
    if (user.passwordHash) {
      isValidPassword = await comparePassword(data.password, user.passwordHash);
    } else if (user.accounts && user.accounts.length > 0) {
      // Fallback check on Account table for existing Better-Auth accounts
      for (const account of user.accounts) {
        if (account.password && (await comparePassword(data.password, account.password))) {
          isValidPassword = true;
          // Upgrade user to store direct passwordHash
          await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: account.password },
          });
          break;
        }
      }
    }

    if (!isValidPassword) {
      throw AppError.unauthorized("Invalid email or password");
    }

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * Fetches active current user profile by ID
   */
  static async getUserById(userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw AppError.notFound("User not found or account deactivated");
    }

    return user;
  }
}
