const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const Tank = require("../tank");
const User = require("../user");

const AllTest = sequelize.define(
  "alltest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: ["Water", "Fish", "Shrimp", "Soil", "PCR", "Feed", "Culture"],
      defaultValue: "Water",
      allowNull: false,
    },
    depth: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0.0,
    },
    biomass: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0.0,
    },
    weight: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0.0,
    },
    DOC: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total_feed_day: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0.0,
    },
    planktonTest: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["1", "2", "3"],
      defaultValue: "1",
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    farmer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  { freezeTableName: true }
);

Tank.hasMany(AllTest);
AllTest.belongsTo(Tank);

module.exports = AllTest;
