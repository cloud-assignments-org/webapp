// customTypes.d.ts
declare namespace Express {
    export interface Request {
      user?: { // Make it optional or mandatory based on your logic
        username: string;
        // Add any other user properties you need
      }
    }
  }
  