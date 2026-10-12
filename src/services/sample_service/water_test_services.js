const ApiResponse = require("../../configs/api_response");
const WaterTest = require("../../models/sample/waterTest");
const Tank = require("../../models/tank");
const Farmer = require("../../models/farmer");
const User = require("../../models/user");
const { Op } = require("sequelize");
const AllTest = require("../../models/sample/test");

const createWater = async (req, res) => {
  const { body } = req;
  console.log(body);
  let news = await WaterTest.create(body);
  if (!news) return ApiResponse.error(res, "Something Went Wrong", 200);
  const id = body?.testId;
  let newsList = await AllTest.update(
    { status: "2" },
    {
      where: { id: id },
    }
  );
  return ApiResponse.success(res, news);
};

const getAllWater = async (req, res) => {
  const { user_id } = req.params;
  let newsList = await WaterTest.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: AllTest,
        where: { user_Id: user_id },
      },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);
  var newsFishAll = newsList.map((record) => {
    var trueConditionsForRecord = {};
    const fishPolyType =
      record?.tank?.cultureType == "Fish" ||
      record?.tank?.cultureType == "Shrimp";
    const shrimpType = record?.tank?.cultureType == "Shrimp";
    if (record.ph !== null && (record.ph < 7.5 || record.ph > 8.5)) {
      trueConditionsForRecord.ph = record.ph;
    }

    if (
      record.totalAlkanility !== null &&
      shrimpType &&
      (record.totalAlkanility < 100 || record.totalAlkanility > 300)
    ) {
      trueConditionsForRecord.totalAlkanility = record.totalAlkanility;
    }

    if (
      record.totalAlkanility !== null &&
      fishPolyType &&
      (record.totalAlkanility < 150 || record.totalAlkanility > 500)
    ) {
      trueConditionsForRecord.totalAlkanility = record.totalAlkanility;
    }

    if (
      record.totalHardness !== null &&
      shrimpType &&
      (record.totalHardness < 250 || record.totalHardness > 1800)
    ) {
      trueConditionsForRecord.totalHardness = record.totalHardness;
    }
    if (
      record.totalHardness !== null &&
      fishPolyType &&
      (record.totalHardness < 100 || record.totalHardness > 300)
    ) {
      trueConditionsForRecord.totalHardness = record.totalHardness;
    }
    if (record.tan !== null && record.tan >= 0.5) {
      trueConditionsForRecord.tan = record.tan;
    }

    if (record.nh3 !== null && record.nh3 >= 0.1) {
      trueConditionsForRecord.nh3 = record.nh3;
    }

    if (record.no2 !== null && record.no2 >= 0.25) {
      trueConditionsForRecord.no2 = record.no2;
    }

    if (record.h2s !== null && record.h2s >= 0.01) {
      trueConditionsForRecord.h2s = record.h2s;
    }

    if (
      record.totalDissolvedSolids !== null &&
      record.totalDissolvedSolids <= 200
    ) {
      trueConditionsForRecord.totalDissolvedSolids =
        record.totalDissolvedSolids;
    }

    record.status = trueConditionsForRecord;

    return record;
  });
  return ApiResponse.success(res, newsFishAll);
};

const getWater = async (req, res) => {
  const { id } = req.params;
  let newsList = await WaterTest.findByPk(id, {
    include: [
      { model: AllTest },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  var newsFishAll = (record) => {
    var trueConditionsForRecord = {};
    const fishPolyType =
      record.tank.cultureType == "Fish" || record.tank.cultureType == "Shrimp";
    const shrimpType = record.tank.cultureType == "Shrimp";
    if (record.ph !== null && (record.ph < 7.5 || record.ph > 8.5)) {
      trueConditionsForRecord.ph = record.ph;
    }

    if (
      record.totalAlkanility !== null &&
      shrimpType &&
      (record.totalAlkanility < 100 || record.totalAlkanility > 300)
    ) {
      trueConditionsForRecord.totalAlkanility = record.totalAlkanility;
    }

    if (
      record.totalAlkanility !== null &&
      fishPolyType &&
      (record.totalAlkanility < 150 || record.totalAlkanility > 500)
    ) {
      trueConditionsForRecord.totalAlkanility = record.totalAlkanility;
    }

    if (
      record.totalHardness !== null &&
      shrimpType &&
      (record.totalHardness < 250 || record.totalHardness > 1800)
    ) {
      trueConditionsForRecord.totalHardness = record.totalHardness;
    }
    if (
      record.totalHardness !== null &&
      fishPolyType &&
      (record.totalHardness < 100 || record.totalHardness > 300)
    ) {
      trueConditionsForRecord.totalHardness = record.totalHardness;
    }
    if (record.tan !== null && record.tan >= 0.5) {
      trueConditionsForRecord.tan = record.tan;
    }

    if (record.nh3 !== null && record.nh3 >= 0.1) {
      trueConditionsForRecord.nh3 = record.nh3;
    }

    if (record.no2 !== null && record.no2 >= 0.25) {
      trueConditionsForRecord.no2 = record.no2;
    }

    if (record.h2s !== null && record.h2s >= 0.01) {
      trueConditionsForRecord.h2s = record.h2s;
    }

    if (
      record.totalDissolvedSolids !== null &&
      record.totalDissolvedSolids <= 200
    ) {
      trueConditionsForRecord.totalDissolvedSolids =
        record.totalDissolvedSolids;
    }

    record.status = trueConditionsForRecord;
    return record;
  };
  return ApiResponse.success(res, newsFishAll(newsList));
};

const deleteWater = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "News ID Not Found", 400);
  let newsList = await WaterTest.destroy({ where: { id: id } });

  if (newsList == 0) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const updateWater = async (req, res) => {
  const { id } = req.params;
  var { body } = req;

  if (!id) return ApiResponse.error(res, "News ID Not Found", 400);
  let newsList = await WaterTest.update(body, {
    where: { id: id },
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};
const getAllComplexWater = async (req, res) => {
  var newsList = await WaterTest.findAll({
    where: {
      [Op.or]: [
        {
          ph: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.or]: {
                [Op.lt]: 7.5,
                [Op.gt]: 8.5,
              },
            },
          },
        },
        {
          totalAlkanility: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.or]: {
                [Op.lt]: 150,
                [Op.gt]: 500,
              },
            },
          },
        },
        {
          totalHardness: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.or]: {
                [Op.lt]: 150,
                [Op.gt]: 300,
              },
            },
          },
        },
        ,
        {
          tan: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.gte]: 0.5,
            },
          },
        },
        {
          nh3: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.gte]: 0.1,
            },
          },
        },
        {
          no2: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.gte]: 0.25,
            },
          },
        },
        {
          h2s: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.gte]: 0.01,
            },
          },
        },
        ,
        {
          totalDissolvedSolids: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.lte]: 200,
            },
          },
        },
      ],
    },
    order: [["createdAt", "DESC"]],
    include: [
      { model: AllTest },
      {
        model: Tank,
        where: { [Op.or]: [{ cultureType: "Poly" }, { cultureType: "Fish" }] },
        include: [{ model: Farmer, include: User }],
      },
    ],
  });
  var trueConditions = newsList.map((record) => {
    const trueConditionsForRecord = {};

    if (record.ph !== null && (record.ph < 7.5 || record.ph > 8.5)) {
      trueConditionsForRecord.ph = record.ph;
    }

    if (
      record.totalAlkanility !== null &&
      (record.totalAlkanility < 150 || record.totalAlkanility > 500)
    ) {
      trueConditionsForRecord.totalAlkanility = record.totalAlkanility;
    }

    if (
      record.totalHardness !== null &&
      (record.totalHardness < 150 || record.totalHardness > 300)
    ) {
      trueConditionsForRecord.totalHardness = record.totalHardness;
    }

    if (record.tan !== null && record.tan >= 0.5) {
      trueConditionsForRecord.tan = record.tan;
    }

    if (record.nh3 !== null && record.nh3 >= 0.1) {
      trueConditionsForRecord.nh3 = record.nh3;
    }

    if (record.no2 !== null && record.no2 >= 0.25) {
      trueConditionsForRecord.no2 = record.no2;
    }

    if (record.h2s !== null && record.h2s >= 0.01) {
      trueConditionsForRecord.h2s = record.h2s;
    }
    if (
      record.totalDissolvedSolids !== null &&
      record.totalDissolvedSolids <= 200
    ) {
      trueConditionsForRecord.totalDissolvedSolids =
        record.totalDissolvedSolids;
    }

    record.status = trueConditionsForRecord;

    return record;
  });

  var newsFish = await WaterTest.findAll({
    where: {
      [Op.or]: [
        {
          ph: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.or]: {
                [Op.lt]: 7.5,
                [Op.gt]: 8.5,
              },
            },
          },
        },

        {
          totalAlkanility: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.or]: {
                [Op.lt]: 100,
                [Op.gt]: 300,
              },
            },
          },
        },
        {
          totalHardness: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.or]: {
                [Op.lt]: 250,
                [Op.gt]: 1800,
              },
            },
          },
        },
        {
          tan: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.gte]: 0.5,
            },
          },
        },
        {
          nh3: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.gte]: 0.1,
            },
          },
        },
        {
          no2: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.gte]: 0.25,
            },
          },
        },
        {
          h2s: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.gte]: 0.01,
            },
          },
        },
        {
          totalDissolvedSolids: {
            [Op.and]: {
              [Op.ne]: null, // Check that the ph value is not null
              [Op.lte]: 200,
            },
          },
        },
      ],
    },
    order: [["createdAt", "DESC"]],
    include: [
      { model: AllTest },
      {
        model: Tank,
        where: { cultureType: "Shrimp" },
        include: [{ model: Farmer, include: User }],
      },
    ],
  });
  var trueConditionsFish = newsFish.map((record) => {
    const trueConditionsForRecord = {};

    if (record.ph !== null && (record.ph < 7.5 || record.ph > 8.5)) {
      trueConditionsForRecord.ph = record.ph;
    }

    if (
      record.totalAlkanility !== null &&
      (record.totalAlkanility < 100 || record.totalAlkanility > 300)
    ) {
      trueConditionsForRecord.totalAlkanility = record.totalAlkanility;
    }

    if (
      record.totalHardness !== null &&
      (record.totalHardness < 250 || record.totalHardness > 1800)
    ) {
      trueConditionsForRecord.totalHardness = record.totalHardness;
    }

    if (record.tan !== null && record.tan >= 0.5) {
      trueConditionsForRecord.tan = record.tan;
    }

    if (record.nh3 !== null && record.nh3 >= 0.1) {
      trueConditionsForRecord.nh3 = record.nh3;
    }

    if (record.no2 !== null && record.no2 >= 0.25) {
      trueConditionsForRecord.no2 = record.no2;
    }

    if (record.h2s !== null && record.h2s >= 0.01) {
      trueConditionsForRecord.h2s = record.h2s;
    }

    if (
      record.totalDissolvedSolids !== null &&
      record.totalDissolvedSolids <= 200
    ) {
      trueConditionsForRecord.totalDissolvedSolids =
        record.totalDissolvedSolids;
    }

    record.status = trueConditionsForRecord;

    return record;
  });

  trueConditions.push(...trueConditionsFish);
  return ApiResponse.success(res, trueConditions);
};

const completeWater = async (req, res) => {
  const { id } = req.params;
  var { body } = req;
  if (!id) return ApiResponse.error(res, "Water ID Not Found", 400);
  let newsList = await WaterTest.update(
    {
      suggestion: body.suggestion,
      status: "2",
    },
    {
      where: { id: id },
    }
  );

  const testid = body?.testId;
  let news = await AllTest.update(
    { status: "3" },
    {
      where: { id: testid },
    }
  );

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};
module.exports = {
  createWater,
  getAllWater,
  getWater,
  deleteWater,
  updateWater,
  getAllComplexWater,
  completeWater,
};
