const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db_config");

const State = sequelize.define(
  "state",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    
  },
  { freezeTableName: true }
);



module.exports = State;
