const ApiResponse = require("../../configs/api_response");
const PCRTest = require("../../models/sample/pcrTest");
const Tank = require("../../models/tank");
const Farmer = require("../../models/farmer");
const User = require("../../models/user");
const AllTest = require("../../models/sample/test");
const { Sequelize } = require("sequelize");

const createPCR = async (req, res) => {
  const { body } = req;
  let news = await PCRTest.create(body);
  console.log("these it the log for the data");
  console.log(body);
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

const getAllPCR = async (req, res) => {
  const { user_id } = req.params;
  let newsList = await PCRTest.findAll({
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
    if (record.pcr == "Negative") {
      trueConditionsForRecord.pcr = record.pcr;
    }
    // Create the status field with the JSON-like content
    record.status = trueConditionsForRecord;

    return record;
  });
  return ApiResponse.success(res, trueConditionsCultureTest);
};
const getPCR = async (req, res) => {
  const { id } = req.params;
  let newsList = await PCRTest.findByPk(id, {
    include: [
      { model: AllTest },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);
  let trueConditionsCultureTest = (record) => {
    const trueConditionsForRecord = {
      // id: record.id,
    };
    if (record.pcr == "Negative") {
      trueConditionsForRecord.pcr = record.pcr;
    }
    record.status = trueConditionsForRecord;
    return record;
  };
  return ApiResponse.success(res, trueConditionsCultureTest(newsList));
};

const deletePCR = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "PCR ID Not Found", 400);
  let newsList = await PCRTest.destroy({ where: { id: id } });

  if (newsList == 0) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const updatePCR = async (req, res) => {
  const { id } = req.params;
  var { body } = req;

  if (!id) return ApiResponse.error(res, "PCR ID Not Found", 400);
  let newsList = await PCRTest.update(body, {
    where: { id: id },
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};
const getAllComplexPCR = async (req, res) => {
  let newsList = await PCRTest.findAll({
    where: {
      pcr: "Negative",
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
    if (record.pcr == "Negative") {
      trueConditionsForRecord.pcr = record.pcr;
    }
    // Create the status field with the JSON-like content
    record.status = trueConditionsForRecord;

    return record;
  });
  return ApiResponse.success(res, trueConditionsCultureTest);
};

const completePCR = async (req, res) => {
  const { id } = req.params;
  var { body } = req;
  if (!id) return ApiResponse.error(res, "PCR ID Not Found", 400);
  let newsList = await PCRTest.update(
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
  createPCR,
  getAllPCR,
  getPCR,
  deletePCR,
  updatePCR,
  getAllComplexPCR,
  completePCR,
};
