const ApiResponse = require("../../configs/api_response");
const AllTest = require("../../models/sample/test");
const Tank = require("../../models/tank");
const Farmer = require("../../models/farmer");
const User = require("../../models/user");
const { Op, where } = require("sequelize");
const CultureTest = require("../../models/sample/cultureTest");
const FeedTest = require("../../models/sample/feedTest");
const FishTest = require("../../models/sample/fishTest");
const PCRTest = require("../../models/sample/pcrTest");
const ShrimpTest = require("../../models/sample/shrimpTest");
const SoilTest = require("../../models/sample/soilTest");
const WaterTest = require("../../models/sample/waterTest");
const PlanktonTest = require("../../models/sample/planktonTest");
const moment = require("moment");
const FarmerAndTest = require("../../models/farmerandtest");

const createTest = async (req, res) => {
  const { body } = req;
  const farmerId = req.params.farmerId;
  const twelveHoursAgo = new Date(new Date() - 12 * 60 * 60 * 1000);
  const condition = {
    tankId: body?.tankId,
    type: body?.type,
    createdAt: {
      [Op.gt]: twelveHoursAgo,
    },
    user_id: body?.user_id,
  };

  const isAlreadyExist = await AllTest.findOne({ where: condition });
  if (isAlreadyExist) {
    return ApiResponse.isAlreadyExist(
      res,
      203,
      "Record already exists",
      isAlreadyExist
    );
  }
  let news = await AllTest.create(body);
  if (news) {
    let testAndFarmerExist = await FarmerAndTest.findOne({
      where: {
        userId: body?.user_id,
        farmerId: farmerId,
      },
    });
    if (!testAndFarmerExist) {
      let testAndFarmer = await FarmerAndTest.create({
        userId: body?.user_id,
        farmerId: farmerId,
      });
    }
  }
  if (!news) return ApiResponse.error(res, "Something Went Wrong", 403);
  return ApiResponse.success(res, news);
};

const getAllTest = async (req, res) => {
  const allTypes = [
    "Water",
    "Fish",
    "Shrimp",
    "Soil",
    "PCR",
    "Feed",
    "Culture",
  ];
  const user_id = req.params.userId;
  const typeResults = {};
  const promises = allTypes.map(async (type) => {
    const tests = await AllTest.findAll({
      where: {
        type: type,
        status: "1",
        user_id: user_id,
        createdAt: {
          [Op.between]: [
            moment().startOf("day").toDate(),
            moment().endOf("day").toDate(),
          ],
        },
      },
      order: [["createdAt", "DESC"]],
      include: [{ model: Tank, include: [{ model: Farmer, include: User }] }],
    });
    typeResults[type.toLowerCase()] = tests;
  });
  await Promise.all(promises);

  return ApiResponse.success(res, typeResults);
};

const getAllReportingTest = async (req, res) => {
  const user_id = req.params.userId;
  const allTypes = [
    "Water",
    "Fish",
    "Shrimp",
    "Soil",
    "PCR",
    "Feed",
    "Culture",
  ];
  const typeResults = {};
  const promises = allTypes.map(async (type) => {
    const tests = await AllTest.findAll({
      where: {
        type: type,
        status: "2",
        user_id: user_id,
        createdAt: {
          [Op.between]: [
            moment().startOf("day").toDate(),
            moment().endOf("day").toDate(),
          ],
        },
      },
      order: [["createdAt", "DESC"]],
      include: [{ model: Tank, include: [{ model: Farmer, include: User }] }],
    });
    typeResults[type.toLowerCase()] = tests;
  });
  await Promise.all(promises);

  return ApiResponse.success(res, typeResults);
};
function getDateRange(datefilter) {
  switch (datefilter) {
    case "today":
      return {
        start: moment().startOf("day"),
        end: moment().endOf("day"),
      };
    case "yesterday":
      return {
        start: moment().subtract(1, "days").startOf("day"),
        end: moment().subtract(1, "days").endOf("day"),
      };
    case "thisWeek":
      return {
        start: moment().startOf("week"),
        end: moment().endOf("week"),
      };
    case "thisMonth":
      return {
        start: moment().startOf("month"),
        end: moment().endOf("month"),
      };
    case "dateRange":
      if (dateString.includes("&")) {
        const [startString, endString] = dateString.split("&");
        return {
          start: moment(startString).startOf("day"),
          end: moment(endString).endOf("day"),
        };
      } else {
        console.error("startDate and endDate are required for dateRange");
        return null;
      }
    default:
      console.log(" Daneil these is the date range of code ");
      console.log(datefilter);
      if (typeof datefilter == "string" || datefilter) {
        if (datefilter.includes("&")) {
          const [startString, endString] = datefilter.split("&");
          return {
            start: moment(startString).startOf("day"),
            end: moment(endString).endOf("day"),
          };
        } else {
          console.error("startDate and endDate are required for dateRange");
          return null;
        }
      } else {
        return null;
      }

      return null;
  }
}

const getAllCompleteTest = async (req, res) => {
  const user_id = req.params.userId;
  const datefilter = req.params.date;

  const dateRange = getDateRange(datefilter);

  async function findComplete(model) {
    const whereCondition = { status: "2" };

    if (dateRange) {
      whereCondition.createdAt = {
        [Op.between]: [dateRange.start.toDate(), dateRange.end.toDate()],
      };
    }
    return await model.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: AllTest,
          where: { user_id: user_id },
        },
        {
          model: Tank,
          include: [{ model: Farmer, include: User }],
        },
      ],
    });
  }

  try {
    const water = await findComplete(WaterTest);
    const fish = await findComplete(FishTest);
    const shrimp = await findComplete(ShrimpTest);
    const soil = await findComplete(SoilTest);
    const pcr = await findComplete(PCRTest);
    const feed = await findComplete(FeedTest);
    const culture = await findComplete(CultureTest);

    return ApiResponse.success(res, {
      water,
      fish,
      shrimp,
      soil,
      pcr,
      feed,
      culture,
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
const getAllCompleteForGivenLab = async (req, res) => {
  const { datefilter, state } = req.query;

  const dateRange = getDateRange(datefilter);
  const whereCondition = {};
  if (dateRange) {
    whereCondition.createdAt = {
      [Op.between]: [dateRange.start.toDate(), dateRange.end.toDate()],
    };
  }
  let getAllCompleteForGivenLab = await AllTest.findAll({
    where: whereCondition,
    include: [
      {
        model: Tank,
        include: [
          {
            model: Farmer,
            include: [{ model: User }],
          },
        ],
      },
    ],
  });
  return ApiResponse.success(res, getAllCompleteForGivenLab);
};

const getAllCompleteTestForAdmin = async (req, res) => {
  const { datefilter } = req.query;
  const dateRange = getDateRange(datefilter);

  async function findComplete(model) {
    const whereCondition = { status: "2" };

    if (dateRange) {
      whereCondition.createdAt = {
        [Op.between]: [dateRange.start.toDate(), dateRange.end.toDate()],
      };
    }
    return await model.count({
      where: whereCondition,
    });
  }

  try {
    const water = await findComplete(WaterTest);
    const fish = await findComplete(FishTest);
    const shrimp = await findComplete(ShrimpTest);
    const soil = await findComplete(SoilTest);
    const pcr = await findComplete(PCRTest);
    const feed = await findComplete(FeedTest);
    const culture = await findComplete(CultureTest);

    return ApiResponse.success(res, {
      water,
      fish,
      shrimp,
      soil,
      pcr,
      feed,
      culture,
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getTest = async (req, res) => {
  const { id } = req.params;
  let newsList = await AllTest.findByPk(id, {
    include: [{ model: Tank, include: [{ model: Farmer, include: User }] }],
  });
  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);
  return ApiResponse.success(res, newsList);
};

const deleteTest = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "TestID Not Found", 400);
  let newsList = await AllTest.destroy({ where: { id: id } });
  if (newsList == 0) return ApiResponse.error(res, "Something Went Wrong", 200);
  return ApiResponse.success(res, newsList);
};

const updateTest = async (req, res) => {
  const { id } = req.params;
  var { body } = req;
  if (!id) return ApiResponse.error(res, "TestID Not Found", 400);
  let newsList = await AllTest.update(body, {
    where: { id: id },
  });
  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};
const approveTest = async (req, res) => {
  const { id } = req.params;
  var body = { status: "2" };

  if (!id) return ApiResponse.error(res, "TestID Not Found", 400);
  let newsList = await AllTest.update(body, {
    where: { id: id },
  });
  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const completeTest = async (req, res) => {
  const { id, date } = req.params;
  var body = { status: "3" };

  if (!id) return ApiResponse.error(res, "TestID Not Found", 400);
  
  let newsList = await AllTest.update(body, {
    where: { id: id },
  });
  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};
module.exports = {
  createTest,
  getAllTest,
  getTest,
  deleteTest,
  updateTest,
  approveTest,
  completeTest,
  getAllReportingTest,
  getAllCompleteTest,
  getAllCompleteTestForAdmin,
  getAllCompleteForGivenLab,
};
