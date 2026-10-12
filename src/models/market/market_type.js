const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const MarketZone = require("./market_zone");

const MarketType = sequelize.define(
  "market_type",
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
    status: {
      type: DataTypes.ENUM,
      values: ["1", "2"],
      defaultValue: "1",
    },
  },
  { freezeTableName: true }
);

MarketZone.hasMany(MarketType);
MarketType.belongsTo(MarketZone);

module.exports = MarketType;
