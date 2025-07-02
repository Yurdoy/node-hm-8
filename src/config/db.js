import { Sequelize } from "sequelize";
import fs from "fs";

const configData = JSON.parse(
  fs.readFileSync(new URL("./config.json", import.meta.url))
);

//С 22 версии не работает assert
// import configData from './config.json' assert {type: 'json'}

const env = "development";
const config = configData[env];
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

export default sequelize;
