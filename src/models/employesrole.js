const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db_config");

const EmployerRoles = sequelize.define("EmployerRoles", {
  EmployerId: {
    type: DataTypes.INTEGER,
  },
  RoleId: {
    type: DataTypes.INTEGER,
  },
});

module.exports = EmployerRoles;
