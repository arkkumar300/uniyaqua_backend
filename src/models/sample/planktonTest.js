const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const Tank = require("../tank");
const AllTest = require("./test");

const PlanktonTest = sequelize.define(
  "planktonTest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    useful_Chlorella: {
      type: DataTypes.DOUBLE,
    },
    useful_Oocysts: {
      type: DataTypes.DOUBLE,
    },
    useful_Scenedesmus: {
      type: DataTypes.DOUBLE,
    },
    useful_Eudorina: {
      type: DataTypes.DOUBLE,
    },
    useful_Tetrasolmis: {
      type: DataTypes.DOUBLE,
    },
    useful_Eutreptia: {
      type: DataTypes.DOUBLE,
    },
    useful_Phacus: {
      type: DataTypes.DOUBLE,
    },
    useful_Spriulina: {
      type: DataTypes.DOUBLE,
    },
    useful_Chaetoceros: {
      type: DataTypes.DOUBLE,
    },
    useful_Skeletonema: {
      type: DataTypes.DOUBLE,
    },
    useful_Cyclotella: {
      type: DataTypes.DOUBLE,
    },
    useful_Thalassiosira: {
      type: DataTypes.DOUBLE,
    },
    useful_Copepod: {
      type: DataTypes.DOUBLE,
    },
    useful_Rotifer: {
      type: DataTypes.DOUBLE,
    },
    useful_Nauplius: {
      type: DataTypes.DOUBLE,
    },
    harmful_Noctiluca: {
      type: DataTypes.DOUBLE,
    },
    harmful_Ceratium: {
      type: DataTypes.DOUBLE,
    },
    harmful_Dinophysis: {
      type: DataTypes.DOUBLE,
    },
    harmful_Zoothamnium: {
      type: DataTypes.DOUBLE,
    },
    harmful_Favella: {
      type: DataTypes.DOUBLE,
    },
    harmful_Vorticella: {
      type: DataTypes.DOUBLE,
    },
    harmful_Gregarina: {
      type: DataTypes.DOUBLE,
    },
    harmful_Anabaena: {
      type: DataTypes.DOUBLE,
    },
    harmful_Oscillatoria: {
      type: DataTypes.DOUBLE,
    },
    harmful_Microcystis: {
      type: DataTypes.DOUBLE,
    },
    harmful_Coscinodiscus: {
      type: DataTypes.DOUBLE,
    },
    harmful_Nitzschia: {
      type: DataTypes.DOUBLE,
    },
    harmful_Navicula: {
      type: DataTypes.DOUBLE,
    },
    harmful_Pleurosigma: {
      type: DataTypes.DOUBLE,
    },
    suggestion:{
     type: DataTypes.STRING,
     allowNull: true
    },
    testId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["1", "2"],
      defaultValue: "1",
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Tank.hasMany(PlanktonTest);
PlanktonTest.belongsTo(Tank);

PlanktonTest.belongsTo(AllTest, { foreignKey: 'testId' });

module.exports = PlanktonTest;
