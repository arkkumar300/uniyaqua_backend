const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db_config");
const Farmer = require("./farmer");

const FarmerAndTest = sequelize.define(
  "farmer_and_test",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    farmerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Farmer,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

FarmerAndTest.belongsTo(Farmer, {
  foreignKey: "farmerId",
});

Farmer.hasMany(FarmerAndTest, {
  foreignKey: "farmerId",
});

module.exports = FarmerAndTest;
