import prisma from "../../lib/prisma";

export class CartService {
  /**
   * Fetches cart items for a user by email with tile details
   */
  static async getCartByEmail(email: string) {
    if (!email) return [];

    const items = await prisma.cartItem.findMany({
      where: {
        user: { email },
        isDeleted: false,
      },
      include: { tile: true },
    });

    return items.map((item) => ({
      _id: item.id,
      id: item.id,
      tileId: item.tileId,
      userEmail: email,
      title: item.tile.title,
      image: item.tile.image,
      price: item.tile.price,
      category: item.tile.category,
      quantity: item.quantity,
    }));
  }

  /**
   * Adds an item to cart or increments quantity
   */
  static async addToCart(userEmail: string, tileId: string) {
    const user = await prisma.user.findFirst({
      where: { email: userEmail, isDeleted: false },
    });

    if (!user) {
      return null;
    }

    return prisma.cartItem.upsert({
      where: {
        userId_tileId: {
          userId: user.id,
          tileId,
        },
      },
      update: {
        quantity: { increment: 1 },
        isDeleted: false,
      },
      create: {
        userId: user.id,
        tileId,
        quantity: 1,
      },
    });
  }

  /**
   * Removes an item from cart (soft delete semantics)
   */
  static async deleteFromCart(userEmail: string, tileId: string) {
    const user = await prisma.user.findFirst({
      where: { email: userEmail },
    });

    if (!user) {
      return null;
    }

    return prisma.cartItem.deleteMany({
      where: {
        userId: user.id,
        tileId,
      },
    });
  }
}
