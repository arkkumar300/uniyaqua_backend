const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const Tank = require("../tank");
const AllTest = require("./test");

const FeedTest = sequelize.define(
  "feedTest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    protein: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    moisture: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    ash: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    fiber: {
      type: DataTypes.DECIMAL,
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

Tank.hasMany(FeedTest);
FeedTest.belongsTo(Tank);

FeedTest.belongsTo(AllTest, { foreignKey: 'testId' });

module.exports = FeedTest;
