import { DBConnection } from "../entities/DBConnection.js";

// setting up database check for the user end point
export const dbCheck = async (req: any, res: any, next: any) => {
  if (req.path === "/user") {
    console.log(req.path);
    next();
  } else {
    next();
  }
};
