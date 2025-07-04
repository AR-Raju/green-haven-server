import type { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            }) as FilterQuery<T>
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query }; // copy

    // Filtering
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];

    excludeFields.forEach((el) => delete queryObj[el]);

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(",")?.join(" ") || "-__v";

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    try {
      const totalQueries = this.modelQuery.getFilter();

      // Add timeout to count operation
      const total = (await Promise.race([
        this.modelQuery.model.countDocuments(totalQueries),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Count query timeout")), 5000)
        ),
      ])) as number;

      const page = Number(this?.query?.page) || 1;
      const limit = Number(this?.query?.limit) || 10;
      const totalPage = Math.ceil(total / limit);

      return {
        page,
        limit,
        total,
        totalPage,
      };
    } catch (error) {
      console.error("Count query error:", error);
      // Return default pagination if count fails
      return {
        page: Number(this?.query?.page) || 1,
        limit: Number(this?.query?.limit) || 10,
        total: 0,
        totalPage: 0,
      };
    }
  }
}

export default QueryBuilder;
