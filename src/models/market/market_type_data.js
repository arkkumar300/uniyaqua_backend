const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const MarketType = require("./market_type");

const MarketTypeData = sequelize.define(
  "market_type_data",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    count: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

MarketType.hasMany(MarketTypeData);
MarketTypeData.belongsTo(MarketType);

module.exports = MarketTypeData;
