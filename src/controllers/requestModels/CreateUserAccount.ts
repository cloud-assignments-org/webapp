import { EmailT } from "../types/EmailT.js";

export class CreateUserAccount {
    email!: EmailT;
    password!: string;
    firstName!: string;
    lastName!: string;
}
