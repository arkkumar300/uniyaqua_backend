const ApiResponse = require("../../configs/api_response");
const CultureTest = require("../../models/sample/cultureTest");
const Tank = require("../../models/tank");
const Farmer = require("../../models/farmer");
const User = require("../../models/user");
const { Op } = require("sequelize");
const AllTest = require("../../models/sample/test");

const createCulture = async (req, res) => {
  const { body } = req;
  let news = await CultureTest.create(body);

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

const getAllCulture = async (req, res) => {
  const { user_id } = req.params;
  let newsList = await CultureTest.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: AllTest,
        where: { user_id: user_id },
      },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);
  let trueConditionsCultureTest = newsList.map((record) => {
    const trueConditionsForRecord = {
      // id: record.id,
    };
    if (record.yellowColonies < 0 || record.yellowColonies > 500) {
      trueConditionsForRecord.yellowColonies = record.yellowColonies;
    }

    if (record.greenColonies < 0 || record.greenColonies > 50) {
      trueConditionsForRecord.greenColonies = record.greenColonies;
    }
    record.status = trueConditionsForRecord;

    return record;
  });
  return ApiResponse.success(res, trueConditionsCultureTest);
};
const getCulture = async (req, res) => {
  const { id } = req.params;
  let newsList = await CultureTest.findByPk(id, {
    include: [
      { model: AllTest },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });
  let trueConditionsCultureTest = (record) => {
    console.log(" Record ", record);
    const trueConditionsForRecord = {
      // id: record.id,
    };
    if (record.yellowColonies < 0 || record.yellowColonies > 500) {
      trueConditionsForRecord.yellowColonies = record.yellowColoni;
    }

    if (record.greenColonies < 0 || record.greenColonies > 50) {
      trueConditionsForRecord.greenColonies = record.greenColonies;
    }
    // Create the status field with the JSON-like content
    record.status = trueConditionsForRecord;

    return record;
  };
  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, trueConditionsCultureTest(newsList));
};

const deleteCulture = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "Culture ID Not Found", 400);
  let newsList = await CultureTest.destroy({ where: { id: id } });

  if (newsList == 0) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const updateCulture = async (req, res) => {
  const { id } = req.params;
  var { body } = req;

  if (!id) return ApiResponse.error(res, "Culture ID Not Found", 400);
  let newsList = await CultureTest.update(body, {
    where: { id: id },
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const getAllComplexCulture = async (req, res) => {
  let newsList = await CultureTest.findAll({
    where: {
      [Op.or]: [
        {
          yellowColonies: {
            [Op.notBetween]: [0, 500],
          },
        },
        {
          greenColonies: {
            [Op.notBetween]: [0, 50],
          },
        },
      ],
    },
    order: [["createdAt", "DESC"]],
    include: [
      { model: AllTest },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });
  let trueConditionsCultureTest = newsList.map((record) => {
    const trueConditionsForRecord = {
      // id: record.id,
    };

    if (record.yellowColonies < 0 || record.yellowColonies > 500) {
      trueConditionsForRecord.yellowColonies = record.yellowColonies;
    }

    if (record.greenColonies < 0 || record.greenColonies > 50) {
      trueConditionsForRecord.greenColonies = record.greenColonies;
    }

    // Create the status field with the JSON-like content
    record.status = JSON.stringify(trueConditionsForRecord);

    return record;
  });

  return ApiResponse.success(res, trueConditionsCultureTest);
};

const completeCulture = async (req, res) => {
  const { id } = req.params;
  var { body } = req;

  if (!id) return ApiResponse.error(res, "Culture ID Not Found", 400);
  let newsList = await CultureTest.update(
    { suggestion: body.suggestion, status: "2" },
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
  createCulture,
  getAllCulture,
  getCulture,
  deleteCulture,
  updateCulture,
  getAllComplexCulture,
  completeCulture,
};
