import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BlogServices } from "./blog.service";

const createBlogPost = catchAsync(async (req, res) => {
  const result = await BlogServices.createBlogPostIntoDB(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Blog post created successfully",
    data: result,
  });
});

const getAllBlogPosts = catchAsync(async (req, res) => {
  const result = await BlogServices.getAllBlogPostsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog posts retrieved successfully",
    data: {
      posts: result.result,
      categories: result.categories,
      tags: result.tags,
    },
    pagination: result.meta,
  });
});

const getSingleBlogPost = catchAsync(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Blog id is required",
      data: null,
    });
  }
  const result = await BlogServices.getSingleBlogPostFromDB(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog post retrieved successfully",
    data: result,
  });
});

const updateBlogPost = catchAsync(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Blog id is required",
      data: null,
    });
  }
  const result = await BlogServices.updateBlogPostIntoDB(
    slug,
    req.body,
    req.user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog post updated successfully",
    data: result,
  });
});

const deleteBlogPost = catchAsync(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Blog id is required",
      data: null,
    });
  }
  const result = await BlogServices.deleteBlogPostFromDB(slug, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog post deleted successfully",
    data: result,
  });
});

export const BlogControllers = {
  createBlogPost,
  getAllBlogPosts,
  getSingleBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
