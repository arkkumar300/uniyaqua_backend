const ApiResponse = require("../../configs/api_response");
const SoilTest = require("../../models/sample/soilTest");
const Tank = require("../../models/tank");
const Farmer = require("../../models/farmer");
const User = require("../../models/user");
const AllTest = require("../../models/sample/test");
const { Sequelize } = require("sequelize");

const createSoil = async (req, res) => {
  const { body } = req;
  let news = await SoilTest.create(body);

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

const getAllSoil = async (req, res) => {
  const { user_id } = req.params;
  let newsList = await SoilTest.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      { model: AllTest, where: { user_id: user_id } },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};
const getSoil = async (req, res) => {
  const { id } = req.params;
  let newsList = await SoilTest.findByPk(id, {
    include: [
      { model: AllTest },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const deleteSoil = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "Soil ID Not Found", 400);
  let newsList = await SoilTest.destroy({ where: { id: id } });

  if (newsList == 0) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const updateSoil = async (req, res) => {
  const { id } = req.params;
  var { body } = req;

  if (!id) return ApiResponse.error(res, "Soil ID Not Found", 400);
  let newsList = await SoilTest.update(body, {
    where: { id: id },
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const getAllComplexSoil = async (req, res) => {
  let newsList = await SoilTest.findAll({
    where: {
      observation: {
        [Sequelize.Op.not]: null,
      },
    },
    order: [["createdAt", "DESC"]],
    include: [
      { model: AllTest },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const completeSoil = async (req, res) => {
  const { id } = req.params;
  var { body } = req;
  if (!id) return ApiResponse.error(res, "Soil ID Not Found", 400);
  let newsList = await SoilTest.update(
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
  createSoil,
  getAllSoil,
  getSoil,
  deleteSoil,
  updateSoil,
  getAllComplexSoil,
  completeSoil,
};
