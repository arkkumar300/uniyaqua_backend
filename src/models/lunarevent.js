const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db_config");
const LunarEvent = sequelize.define("lunarevent", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING, // ✅ FIX
    allowNull: false,
  },

  date: {
    type: DataTypes.DATE, // ✅ FIX
    allowNull: false,
  },
});
module.exports = LunarEvent;
