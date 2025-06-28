import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import QueryBuilder from "../../builder/QueryBuilder"
import { Product } from "../product/product.model"
import type { TCategory } from "./category.interface"
import { Category } from "./category.model"

const CategorySearchableFields = ["name", "description"]

const createCategoryIntoDB = async (categoryData: TCategory) => {
  const result = await Category.create(categoryData)
  return result
}

const getAllCategoriesFromDB = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(CategorySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await categoryQuery.modelQuery
  const meta = await categoryQuery.countTotal()

  // Get product count for each category
  const categoriesWithCount = await Promise.all(
    result.map(async (category: any) => {
      const productCount = await Product.countDocuments({
        category: category._id,
      })
      return {
        ...category.toObject(),
        productCount,
      }
    }),
  )

  return {
    meta,
    result: categoriesWithCount,
  }
}

const getSingleCategoryFromDB = async (id: string) => {
  const category = await Category.findById(id)
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found")
  }

  // Get product count
  const productCount = await Product.countDocuments({
    category: category._id,
  })

  return {
    ...category.toObject(),
    productCount,
  }
}

const updateCategoryIntoDB = async (id: string, payload: Partial<TCategory>) => {
  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found")
  }

  return result
}

const deleteCategoryFromDB = async (id: string) => {
  // Check if category has products
  const productCount = await Product.countDocuments({ category: id })
  if (productCount > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete category with existing products")
  }

  const result = await Category.findByIdAndDelete(id)
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found")
  }

  return result
}

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
}
