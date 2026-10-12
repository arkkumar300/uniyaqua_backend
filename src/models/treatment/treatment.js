const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const Problem = require("./problem");

const Treatment = sequelize.define(
  "treatment",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl1: {
      type: DataTypes.TEXT,
    },
    imageUrl2: {
      type: DataTypes.TEXT,
    },
    imageUrl3: {
      type: DataTypes.TEXT,
    },
    importCount: {
      type: DataTypes.INTEGER,
      defaultValue:0
    },
    status: {
      type: DataTypes.ENUM,
      values: ["1", "2", "3"],
      defaultValue: "1",
    },
  },
  { freezeTableName: true }
);
Problem.hasMany(Treatment);
Treatment.belongsTo(Problem);

module.exports = Treatment;
