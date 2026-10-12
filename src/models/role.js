const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db_config");

const Role = sequelize.define("Roles", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
});

module.exports = Role;
