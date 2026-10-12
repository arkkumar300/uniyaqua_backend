const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db_config");
const User = require("./user");

const LabAssistant = sequelize.define(
  "labAssistant",
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
      unique: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    pin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qualification: {
      type: DataTypes.ENUM,
      values: [
        "BSc",
        "MSc",
        "Diploma",
        "Phd",
        "BA",
        "MA",
        "MBA",
        "High School",
        "No",
      ],
      allowNull: false,
    },
    labName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["Default", "Pending", "Approved", "Rejected"],
      defaultValue: "Pending",
    },
  },
  { freezeTableName: true }
);

User.hasMany(LabAssistant);
LabAssistant.belongsTo(User);

module.exports = LabAssistant;
