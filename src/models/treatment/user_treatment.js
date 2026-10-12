const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const Treatment = require("./treatment");
const User = require("../user");

const UserTreatment = sequelize.define(
  "user_treatment",
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

    status: {
      type: DataTypes.ENUM,
      values: ["1", "2"],
      defaultValue: "1",
    },
  },
  { freezeTableName: true }
);
Treatment.hasMany(UserTreatment);
UserTreatment.belongsTo(Treatment);

User.hasMany(UserTreatment);
UserTreatment.belongsTo(User);

module.exports = UserTreatment;
