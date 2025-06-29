import httpStatus from "http-status";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Product } from "../product/product.model";
import type { TCategory } from "./category.interface";
import { Category } from "./category.model";

const CategorySearchableFields = ["name", "description"];

const createCategoryIntoDB = async (categoryData: TCategory) => {
  const result = await Category.create(categoryData);
  return result;
};

const getAllCategoriesFromDB = async (query: Record<string, unknown>) => {
  try {
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      throw new AppError(
        httpStatus.SERVICE_UNAVAILABLE,
        "Database connection not available"
      );
    }

    const categoryQuery = new QueryBuilder(Category.find(), query)
      .search(CategorySearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    // Execute with timeout
    const result = (await Promise.race([
      categoryQuery.modelQuery.exec(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Query timeout")), 8000)
      ),
    ])) as any[];

    const meta = await categoryQuery.countTotal();

    // Get product count for each category with timeout
    const categoriesWithCount = await Promise.all(
      result.map(async (category: any) => {
        try {
          const productCount = (await Promise.race([
            Product.countDocuments({ category: category._id }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Count timeout")), 5000)
            ),
          ])) as number;

          return {
            ...category.toObject(),
            productCount,
          };
        } catch (error) {
          console.error(
            "Product count error for category:",
            category._id,
            error
          );
          return {
            ...category.toObject(),
            productCount: 0,
          };
        }
      })
    );

    return {
      meta,
      result: categoriesWithCount,
    };
  } catch (error) {
    console.error("Category query error:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to fetch categories. Please try again."
    );
  }
};

const getSingleCategoryFromDB = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  // Get product count
  const productCount = await Product.countDocuments({
    category: category._id,
  });

  return {
    ...category.toObject(),
    productCount,
  };
};

const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<TCategory>
) => {
  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return result;
};

const deleteCategoryFromDB = async (id: string) => {
  // Check if category has products
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot delete category with existing products"
    );
  }

  const result = await Category.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
