// src/authentication.ts
import * as express from "express";
import { User } from "../entities/User.js";
import { hashPasswordAndEncode } from "../utils/bcryptHashing.util.js";

// This could be your adapted authentication function for tsoa
export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "basicAuth") {
    console.log("In basic auth tsoa middle");
    // Check if the specific route and method match your criteria
    if (request.path === "/user" && request.method === "PATCH") {
      const authHeader = request.headers.authorization;

      console.log("within tsoa auth header");

      if (!authHeader) {
        throw new Error("No authorization header"); // tsoa expects to catch errors
      }

      const base64Credentials = authHeader.split(" ")[1];
      console.log(base64Credentials);

      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "ascii"
      );
      
      const [username, password] = credentials.split(":");

      console.log(username, password);

      const user = await User.findOneBy({
        email: username,
      });

      if (!user) {
        throw new Error("Authentication failed"); // User not found
      }

      console.log("user ", user);

      // hashed password 
      const hashedPassword = await hashPasswordAndEncode(username, password);

      console.log("hashed password ", hashedPassword);

      const passwordMatch = hashedPassword === user.password;
      console.log("Password match ", passwordMatch);
      if (passwordMatch) {
        console.log("resolving promise");
        // If authentication is successful, you might attach the user to the request or simply return true
        // Note: Modifying the request object here won't necessarily propagate to your route handlers
        return Promise.resolve({
          user: {
            userName: username
          }
        });
      } else {
        throw new Error("Authentication failed"); // Password does not match
      }
    }
  } else {
    // If the securityName does not match "basicAuth", you might want to handle other authentication types or throw an error
    throw new Error(`Unknown securityName ${securityName}`);
  }
}
