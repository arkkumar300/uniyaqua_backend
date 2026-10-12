const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db_config");

const Calculator = sequelize.define(
  "calculator",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inputA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    inputB: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    formula: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

module.exports = Calculator;
