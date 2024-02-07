import { EmailT } from "../types/EmailT.js";

export class UserResponse {
  email!: EmailT;
  firstName!: string;
  lastName!: string;
  id!: string;
  dateCreated!: Date;
  lastModified!: Date;
}
