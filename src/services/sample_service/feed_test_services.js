const ApiResponse = require("../../configs/api_response");
const FeedTest = require("../../models/sample/feedTest");
const Tank = require("../../models/tank");
const Farmer = require("../../models/farmer");
const User = require("../../models/user");
const AllTest = require("../../models/sample/test");

const createFeed = async (req, res) => {
  const { body } = req;
  let news = await FeedTest.create(body);

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

const getAllFeed = async (req, res) => {
  const { user_id } = req.params;
  let newsList = await FeedTest.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      { model: AllTest, where: { user_id: user_id } },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};
const getFeed = async (req, res) => {
  const { id } = req.params;
  let newsList = await FeedTest.findByPk(id, {
    include: [
      { model: AllTest },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const deleteFeed = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "Feed ID Not Found", 400);
  let newsList = await FeedTest.destroy({ where: { id: id } });

  if (newsList == 0) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const updateFeed = async (req, res) => {
  const { id } = req.params;
  var { body } = req;

  if (!id) return ApiResponse.error(res, "Feed ID Not Found", 400);
  let newsList = await FeedTest.update(body, {
    where: { id: id },
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const completeFeed = async (req, res) => {
  const { id } = req.params;
  var { body } = req;

  if (!id) return ApiResponse.error(res, "Feed ID Not Found", 400);
  let newsList = await FeedTest.update(
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
  createFeed,
  getAllFeed,
  getFeed,
  deleteFeed,
  updateFeed,
  completeFeed,
};
