import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const User = db.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING(25),
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: DataTypes.STRING,
    refresh_token: DataTypes.TEXT,
  },
  { freezeTableName: true }
);

export default User;
