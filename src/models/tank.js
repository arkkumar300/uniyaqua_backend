const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db_config");
const Farmer = require("./farmer");
const Tank = sequelize.define(
  "tank",
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
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cultureType: {
      type: DataTypes.ENUM,
      values: ["Fish", "Shrimp", "Poly"],
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

Farmer.hasMany(Tank);
Tank.belongsTo(Farmer);

module.exports = Tank;
