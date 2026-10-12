const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const Tank = require("../tank");
const AllTest = require("./test");

const ShrimpTest = sequelize.define(
  "shrimpTest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    externalAbnormalColor: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    externalLesionUclers: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    externalExcessiveMucus: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    externalMalformations: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    gillsDiscoloration: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      defaultValue: "No" 
        },
    gillsParasites: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      defaultValue: "No" 
    },
    hepatopancreasDiscoloration: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      defaultValue: "No" 
    },
    hepatopancreasEnlargement: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    stomachForeignMaterial: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    stomachAbnormalities: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    reproductiveAbnormalities: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    intestineBlockages: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    intestineParasites: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    muscleTissueDiscoloration: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    muscleTissueLesions: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    nervousSystemAbnormalities: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    generalBehaviorWeeknessOrLethargy: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    generalBehaviorReducedFeeding: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    specificDiseaseWhiteSpotSyndromeVirus: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    specificDiseaseInfectiousHypodermalVirus: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    specificDiseaseRunningMortalitySydrome: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    specificDiseaseTauraSyndromeVirus: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    specificDiseaseYellowHeadVirus: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    specificDiseaseEarlyMortalitySydrome: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    specificDiseaseVibrioInfections: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    specificDiseaseAeromonasInfections: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    specificDiseaseEHP: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    specificDiseaseFungiAndBacteria: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    diagnosedProblemAndDisease: {
      type: DataTypes.STRING,
      allowNull: false,
    }, // the is new
    externalBodyCramps: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    externalTailRoot: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    externalVibrio: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    gillsBlackGills: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    gillsBrownGills: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    hepatopancreasShrinked: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    intestineFluids: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    intestineWhiteGut: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    intestineWhiteFecus: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    muscleTissueWhiteMuscle: {
      type: DataTypes.ENUM,
      values: ["Yes", "No"],
      allowNull: false,
    },
    // end of new
    suggestion: {
      type: DataTypes.STRING,
      allowNull: true,
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

Tank.hasMany(ShrimpTest);
ShrimpTest.belongsTo(Tank);

ShrimpTest.belongsTo(AllTest, { foreignKey: "testId" });

module.exports = ShrimpTest;
