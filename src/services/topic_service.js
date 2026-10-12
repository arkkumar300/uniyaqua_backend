const ApiResponse = require("../configs/api_response");
const Topic = require("../models/topic");
const Fuse = require("fuse.js");

const createTopic = async (req, res) => {
  //Creating
  let topic = await Topic.create({
    name: req.body.name,
  });

  console.log(topic);
  if (!topic) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, topic);
};

const getAllTopic = async (req, res) => {
  let topicList = await Topic.findAll({
    where: { status: "1" },
    order: [["createdAt", "DESC"]],
  });

  if (!topicList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, topicList);
};

const getTopic = async (req, res) => {
  const { id } = req.params;
  let topic = await Topic.findOne({
    where: {
      id: id,
    },
  });

  if (!topic) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, topic);
};

const deleteTopic = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "Topic ID Not Found", 400);
  let topicList = await Topic.destroy({
    where: {
      id: id,
    },
  });

  if (topicList == 0)
    return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, topicList);
};

const updateTopic = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "Topic ID Not Found", 400);
  let topicList = await Topic.update(
    {
      name: req.body.name,
    },
    {
      where: { id: id },
    }
  );

  if (!topicList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, topicList);
};

module.exports = {
  createTopic,
  getAllTopic,
  deleteTopic,
  updateTopic,
  getTopic,
};
