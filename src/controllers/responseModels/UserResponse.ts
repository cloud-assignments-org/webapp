import { IResponseModel } from "./IResponseModel.js";
import { EmailT } from "../types/EmailT.js";
import { BaseResponse } from "./BaseResponse.js";
import { User } from "../../entities/User.js";

export class UserResponse extends BaseResponse implements IResponseModel<User> {

  constructor(entity: User) {
    super(entity);

    this.email = entity.email;
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
  }
  
  email: EmailT;
  firstName: string;
  lastName: string;

  createFromEntity(entity: User): IResponseModel<User> {
    return new UserResponse(entity);
  }
}
