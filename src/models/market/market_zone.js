const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const Market = require("./market");

const MarketZone = sequelize.define(
  "market_zone",
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

Market.hasMany(MarketZone);
MarketZone.belongsTo(Market);

module.exports = MarketZone;
