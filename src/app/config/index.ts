import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as string,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
  cors_origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  image_bb_api_key: process.env.IMAGE_BB_API_KEY,
};
