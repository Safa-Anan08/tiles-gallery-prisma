import prisma from "../../lib/prisma";
import { AppError } from "../../errors/appError";

export class ReviewService {
  static async getReviewsByTileId(tileId: string) {
    return prisma.review.findMany({
      where: { tileId, isDeleted: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getReviewById(id: string) {
    const review = await prisma.review.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!review) {
      throw AppError.notFound("Review not found");
    }

    return review;
  }

  static async createReview(
    userId: string,
    data: { rating: number; comment: string; tileId: string }
  ) {
    const tile = await prisma.tile.findFirst({
      where: { id: data.tileId, isDeleted: false },
    });

    if (!tile) {
      throw AppError.notFound("Tile not found");
    }

    return prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        tileId: data.tileId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  static async updateReview(
    id: string,
    userId: string,
    data: { rating?: number; comment?: string }
  ) {
    const review = await this.getReviewById(id);

    if (review.userId !== userId) {
      throw AppError.forbidden("You are not authorized to update this review");
    }

    return prisma.review.update({
      where: { id },
      data,
    });
  }

  static async deleteReview(id: string, userId: string, isAdmin: boolean = false) {
    const review = await this.getReviewById(id);

    if (!isAdmin && review.userId !== userId) {
      throw AppError.forbidden("You are not authorized to delete this review");
    }

    return prisma.review.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
