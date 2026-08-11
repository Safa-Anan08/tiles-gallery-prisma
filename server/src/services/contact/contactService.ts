import prisma from "../../lib/prisma";

export class ContactService {

  static async createMessage(data: { name: string; email: string; message: string }) {
    return prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    });
  }
}
