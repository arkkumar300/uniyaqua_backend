const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db_config");
const Role = require("./role"); // Ensure the Role model is properly imported
const Employer = sequelize.define("Employers", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
Employer.belongsToMany(Role, { through: "EmployerRoles" });
Role.belongsToMany(Employer, { through: "EmployerRoles" });

module.exports = Employer;
