const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const Tank = require("../tank");
const AllTest = require("./test");

const CultureTest = sequelize.define(
  "cultureTest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    yellowColonies: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    greenColonies: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    testId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    suggestion:{
     type: DataTypes.STRING,
     allowNull: true
    },
    status: {
      type: DataTypes.ENUM,
      values: ["1", "2"],
      defaultValue: "1",
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Tank.hasMany(CultureTest);
CultureTest.belongsTo(Tank);

CultureTest.belongsTo(AllTest, { foreignKey: 'testId' });

module.exports = CultureTest;
