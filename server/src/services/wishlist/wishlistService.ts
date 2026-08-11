import prisma from "../../lib/prisma";

export class WishlistService {
  /**
   * Fetches wishlist items for a user by email
   */
  static async getWishlistByEmail(email: string) {
    if (!email) return [];

    const items = await prisma.wishlistItem.findMany({
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
      description: item.tile.description,
      image: item.tile.image,
      price: item.tile.price,
      category: item.tile.category,
    }));
  }

  /**
   * Adds an item to wishlist
   */
  static async addToWishlist(userEmail: string, tileId: string) {
    const user = await prisma.user.findFirst({
      where: { email: userEmail, isDeleted: false },
    });

    if (!user) {
      return null;
    }

    return prisma.wishlistItem.upsert({
      where: {
        userId_tileId: {
          userId: user.id,
          tileId,
        },
      },
      update: {
        isDeleted: false,
      },
      create: {
        userId: user.id,
        tileId,
      },
    });
  }

  /**
   * Removes an item from wishlist
   */
  static async deleteFromWishlist(userEmail: string, tileId: string) {
    const user = await prisma.user.findFirst({
      where: { email: userEmail },
    });

    if (!user) {
      return null;
    }

    return prisma.wishlistItem.deleteMany({
      where: {
        userId: user.id,
        tileId,
      },
    });
  }
}
