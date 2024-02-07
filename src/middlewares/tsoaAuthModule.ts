// src/authentication.ts
import * as express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../entities/User.js';

// This could be your adapted authentication function for tsoa
export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "basicAuth") {
    // Check if the specific route and method match your criteria
    if (request.path === "/user" && (request.method === "PATCH")) {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new Error("No authorization header"); // tsoa expects to catch errors
      }

      const base64Credentials = authHeader.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
      const [username, password] = credentials.split(":");

      const user = await User.findOneBy({
        email: username,
      });

      if (!user) {
        throw new Error("Authentication failed"); // User not found
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // If authentication is successful, you might attach the user to the request or simply return true
        // Note: Modifying the request object here won't necessarily propagate to your route handlers
        return true;
      } else {
        throw new Error("Authentication failed"); // Password does not match
      }
    }
  } else {
    // If the securityName does not match "basicAuth", you might want to handle other authentication types or throw an error
    throw new Error(`Unknown securityName ${securityName}`);
  }
}
