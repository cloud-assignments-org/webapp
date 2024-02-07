import { DBConnection } from "../entities/DBConnection.js";

// setting up database check for the user end point
export const dbCheck = async (req: any, res: any, next: any) => {
  if (req.path === "/user") {
    const connection = (await DBConnection.find())[0];
    if (!connection) {
      res.status(503).end();
    }
    next();
  } else {
    next();
  }
};
