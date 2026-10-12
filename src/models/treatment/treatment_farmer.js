const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const Treatment = require("./treatment");

const TreatmentFramer = sequelize.define(
  "treatment_framer",
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
    nameOne: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tankOne: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneOne: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameTwo: {
      type: DataTypes.STRING,
    },
    tankTwo: {
      type: DataTypes.STRING,
    },
    phoneTwo: {
      type: DataTypes.STRING,
    },
    nameThree: {
      type: DataTypes.STRING,
    },
    tankThree: {
      type: DataTypes.STRING,
    },
    phoneThree: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["1", "2"],
      defaultValue: "1",
    },
  },
  { freezeTableName: true }
);
Treatment.hasMany(TreatmentFramer);
TreatmentFramer.belongsTo(Treatment);

module.exports = TreatmentFramer;
