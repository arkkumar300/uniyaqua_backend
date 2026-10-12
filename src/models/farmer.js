const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db_config");
const User = require("./user");

const Farmer = sequelize.define(
  "farmer",
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
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Kerala",
    },
    district: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Bidar",
    },
    cultureType: {
      type: DataTypes.ENUM,
      values: ["Fish", "Shrimp", "Both", "Poly"],
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["1", "2"],
      defaultValue: "1",
    },
  },
  { freezeTableName: true }
);
User.hasMany(Farmer);
Farmer.belongsTo(User);
module.exports = Farmer;
