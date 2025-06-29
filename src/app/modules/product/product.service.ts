import httpStatus from "http-status";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Category } from "../category/category.model";
import type { TProduct } from "./product.interface";
import { Product } from "./product.model";

const ProductSearchableFields = ["title", "description"];

const createProductIntoDB = async (productData: TProduct) => {
  // Verify category exists
  const categoryExists = await Category.findById(productData.category);
  if (!categoryExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
  }

  const result = await Product.create(productData);
  await result.populate("category", "name");
  return result;
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  try {
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      throw new AppError(
        httpStatus.SERVICE_UNAVAILABLE,
        "Database connection not available"
      );
    }

    const productQuery = new QueryBuilder(
      Product.find().populate("category", "name"),
      query
    )
      .search(ProductSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    // Execute with timeout
    const result = (await Promise.race([
      productQuery.modelQuery.exec(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Query timeout")), 8000)
      ),
    ])) as any[];

    const meta = await productQuery.countTotal();

    return {
      meta,
      result,
    };
  } catch (error) {
    console.error("Product query error:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to fetch products. Please try again."
    );
  }
};

const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findById(id).populate("category", "name");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
  return result;
};

const updateProductIntoDB = async (id: string, payload: Partial<TProduct>) => {
  // If category is being updated, verify it exists
  if (payload.category) {
    const categoryExists = await Category.findById(payload.category);
    if (!categoryExists) {
      throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
    }
  }

  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("category", "name");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  return result;
};

const deleteProductFromDB = async (id: string) => {
  const result = await Product.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductIntoDB,
  deleteProductFromDB,
};
