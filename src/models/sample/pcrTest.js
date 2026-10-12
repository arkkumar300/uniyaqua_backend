const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const Tank = require("../tank");
const AllTest = require("./test");

const PCRTest = sequelize.define(
  "pcrTest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    whiteSpotCtValue: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    whiteSpotResult: {
      type: DataTypes.STRING(300),
    },

    enterocytozoonCtValue: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    enterocytozoonResult: {
      type: DataTypes.STRING(300),
    },

    ihhnvCtValue: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    ihhnvResult: {
      type: DataTypes.STRING(300),
    },

    emsCtValue: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    emsResult: {
      type: DataTypes.STRING(300),
    },

    imnvCtValue: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    imnvResult: {
      type: DataTypes.STRING(300),
    },

    vHarveyCtValue: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    vHarveyResult: {
      type: DataTypes.STRING(300),
    },

    vParahaemolyticusCtValue: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    vParahaemolyticusResult: {
      type: DataTypes.STRING(300),
    },

    remarkText: {
      type: DataTypes.STRING(300),
      defaultValue: "No Remarks",
    },
    testId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    suggestion: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("1", "2"),
      defaultValue: "1",
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Tank.hasMany(PCRTest);
PCRTest.belongsTo(Tank);

PCRTest.belongsTo(AllTest, { foreignKey: "testId" });

module.exports = PCRTest;
