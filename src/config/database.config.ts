import { DataSource } from "typeorm";
import { User } from "../entities/User.js";
import { EnvConfiguration } from "./env.config.js";

const AppDataSource = new DataSource({
  type: EnvConfiguration.DB_TYPE as "postgres",
  host: EnvConfiguration.DB_HOST,
  port: +EnvConfiguration.DB_PORT,
  username: EnvConfiguration.DB_USERNAME,
  password: EnvConfiguration.DB_PASSWORD,
  database: EnvConfiguration.DB_NAME,
  entities: [User], // use path.join() for windows
  synchronize: true,
  // logging: true,
  // dropSchema: true,
});

export { AppDataSource };