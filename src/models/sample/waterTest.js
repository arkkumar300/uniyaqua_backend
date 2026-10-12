const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const AllTest = require("./test");
const Tank = require("../tank");

const WaterTest = sequelize.define(
  "waterFishTest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ph: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("ph");
        return value !== null ? parseFloat(value) : null;
      },
    },
    temprature: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("temprature");
        return value !== null ? parseFloat(value) : null;
      },
    },
    salinity: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("salinity");
        return value !== null ? parseFloat(value) : null;
      },
    },
    co3: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("co3");
        return value !== null ? parseFloat(value) : null;
      },
    },
    hco3: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("hco3");
        return value !== null ? parseFloat(value) : null;
      },
    },
    totalAlkanility: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("totalAlkanility");
        return value !== null ? parseFloat(value) : null;
      },
    },
    totalHardness: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("totalHardness");
        return value !== null ? parseFloat(value) : null;
      },
    },
    ca: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("ca");
        return value !== null ? parseFloat(value) : null;
      },
    },
    mg: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("mg");
        return value !== null ? parseFloat(value) : null;
      },
    },
    k: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("k");
        return value !== null ? parseFloat(value) : null;
      },
    },
    fe: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("fe");
        return value !== null ? parseFloat(value) : null;
      },
    },
    na: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("na");
        return value !== null ? parseFloat(value) : null;
      },
    },
    cl2: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("cl2");
        return value !== null ? parseFloat(value) : null;
      },
    },
    tan: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("tan");
        return value !== null ? parseFloat(value) : null;
      },
    },
    nh3: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("nh3");
        return value !== null ? parseFloat(value) : null;
      },
    },
    no2: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("no2");
        return value !== null ? parseFloat(value) : null;
      },
    },
    h2s: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("h2s");
        return value !== null ? parseFloat(value) : null;
      },
    },
    co2: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("co2");
        return value !== null ? parseFloat(value) : null;
      },
    },
    dissolvedOxygen: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("dissolvedOxygen");
        return value !== null ? parseFloat(value) : null;
      },
    },
    electricalConductivity: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("electricalConductivity");
        return value !== null ? parseFloat(value) : null;
      },
    },
    totalDissolvedSolids: {
      type: DataTypes.DECIMAL,
      get() {
        const value = this.getDataValue("totalDissolvedSolids");
        return value !== null ? parseFloat(value) : null;
      },
    },
    suggestion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    testId: {
      type: DataTypes.INTEGER,
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

Tank.hasMany(WaterTest);
WaterTest.belongsTo(Tank);

WaterTest.belongsTo(AllTest, { foreignKey: "testId" });
module.exports = WaterTest;
