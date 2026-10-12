const ApiResponse = require("../../configs/api_response");
const PlanktonTest = require("../../models/sample/planktonTest");
const Tank = require("../../models/tank");
const Farmer = require("../../models/farmer");
const User = require("../../models/user");
const AllTest = require("../../models/sample/test");
const { Sequelize } = require("sequelize");

const createPlankton = async (req, res) => {
  const { body } = req;
  let news = await PlanktonTest.create(body);

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

const getAllPlankton = async (req, res) => {
  console.log("getAllPlankton");
  let newsList = await PlanktonTest.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      { model: AllTest },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);
  const trueConditionsPlankton = newsList.map((record) => {
    const trueConditionsForRecord = {
      // id: record.id,
      // status: {}, // Initialize the status object
    };
    // Iterate over the attributes and apply your conditions
    for (const key in record.dataValues) {
      if (
        key !== "id" && // Exclude 'id' from attributes
        key.startsWith("harmful_Microcystis") && // Exclude attributes starting with 'harmful_'
        record[key] !== null
      ) {
        trueConditionsForRecord[key] = record[key];
      }
    }

    record.status = trueConditionsForRecord;
    return record;
  });

  return ApiResponse.success(res, trueConditionsPlankton);
};
const getPlankton = async (req, res) => {
  const { id } = req.params;
  let newsList = await PlanktonTest.findByPk(id, {
    include: [
      { model: AllTest },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);
  const plankTonTest = (record) => {
    const trueConditionsForRecord = {
      // id: record.id,
      // status: {}, // Initialize the status object
    };
    // Iterate over the attributes and apply your conditions
    for (const key in record.dataValues) {
      if (
        key !== "id" && // Exclude 'id' from attributes
        key.startsWith("harmful_Microcystis") && // Exclude attributes starting with 'harmful_'
        record[key] !== null
      ) {
        trueConditionsForRecord[key] = record[key];
      }
    }

    record.status = trueConditionsForRecord;
    return record;
  };
  return ApiResponse.success(res, plankTonTest(newsList));
};

const deletePlankton = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "Plankton ID Not Found", 400);
  let newsList = await PlanktonTest.destroy({ where: { id: id } });

  if (newsList == 0) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const updatePlankton = async (req, res) => {
  const { id } = req.params;
  var { body } = req;

  if (!id) return ApiResponse.error(res, "Plankton ID Not Found", 400);
  let newsList = await PlanktonTest.update(body, {
    where: { id: id },
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const getAllComplexPlankton = async (req, res) => {
  let newsList = await PlanktonTest.findAll({
    where: {
      harmful_Microcystis: {
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
  const trueConditionsPlankton = newsList
    .map((record) => {
      const trueConditionsForRecord = {
        // id: record.id,
      };
      for (const key in record.dataValues) {
        if (
          key !== "id" && // Exclude 'id' from attributes
          key.startsWith("harmful_Microcystis") && // Exclude attributes starting with 'harmful_'
          record[key] !== null
        ) {
          trueConditionsForRecord[key] = record[key];
        }
      }

      record.status = trueConditionsForRecord;
      return record;
    })
    .filter((record) => Object.keys(record?.status).length > 0); // Filter to return only non-empty records
  return ApiResponse.success(res, trueConditionsPlankton);
};

const completePlankton = async (req, res) => {
  const { id } = req.params;
  var { body } = req;
  if (!id) return ApiResponse.error(res, "Plankton ID Not Found", 400);
  let newsList = await PlanktonTest.update(
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
const getCompletePlanktonWithID = async (req, res) => {
  const { id } = req.params;
  var { body } = req;
  if (!id) return ApiResponse.error(res, "Plankton ID Not Found", 400);
  let newsList = await PlanktonTest.findOne({
    where: { testId: id },
  });
  return ApiResponse.success(res, newsList);
};

module.exports = {
  getCompletePlanktonWithID,
  createPlankton,
  getAllPlankton,
  getPlankton,
  deletePlankton,
  updatePlankton,
  getAllComplexPlankton,
  completePlankton,
};
