const ApiResponse = require("../configs/api_response");
const Video = require("../models/video");
const uploadToCloud = require("../configs/uploadToCloud");
const Topic = require("../models/topic");
const Sequelize = require('sequelize');
const create = async (req, res) => {
  //Creating Video
  const { file } = req;
  const { url } = await uploadToCloud(file?.filename);
  console.log(url, req.body);
  let news = await Video.create({
    title: req.body.title,
    description:req.body.description,
    thumbnailUrl: url,
    url: req.body.url,
    userId: req.user.id,
    // topicId: req.body.topicId
  });

  if (!news) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, news);
};

const getAllVideo = async (req, res) => {
  console.log(" Get All Video ")
  let videosList = await Video.findAll({
    order: [["createdAt", "DESC"]],
  });
   console.log(" Get All Video ")
  if (!videosList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, videosList);
};

const getVideo = async (req, res) => {
  const {id} = req.params
  console.log(" Get 1 Video ",id)
  let videosList = await Video.findOne({where: {id: id}})
  if (!videosList) return ApiResponse.error(res, "Something Went Wrong", 200);
  console.log(" Result ",videosList)
  return ApiResponse.success(res, videosList);
};

const deleteVideo = async (req, res) => {
  const { videoId } = req.query;
  if (!videoId) return ApiResponse.error(res, "Video ID Not Found", 400);
  let videosList = await Video.update(
    {
      status: "2",
    },
    {
      where: { id: videoId },
    }
  );

  if (!videosList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, videosList);
};

const updateVideo = async (req, res) => {
  const { videoId } = req.query;
  if (!videoId) return ApiResponse.error(res, "Video ID Not Found", 400);
  let videosList = await Video.update(
    {
      title: req.body.title,
      // thumbnailUrl: req.body.thumbnailUrl,
      // url: req.body.url,
    },
    {
      where: { id: videoId },
    }
  );

  if (!videosList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, videosList);
};


const inactiveVideo = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "Video ID Not Found", 400);
  let videosList = await Video.update(
    {
      status:req.body.status
    },
    {
      where: { id: id },
    }
  );

  if (!videosList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, videosList);
};

const searchVideo = async (req, res) => {
  const { name } = req.query
  if (!name ) {
    let videosList = await Video.findAll({});
    console.log(" Name ",name)
    return ApiResponse.success(res, videosList);
  }
  let videosList = await Video.findAll({
    where: {
        [Sequelize.Op.or]: [
          { title: { [Sequelize.Op.like]: `%${name}%` } },
          { description: { [Sequelize.Op.like]: `%${name}%` } }
        ]
      }
})
  if (!videosList) return ApiResponse.error(res, "Something Went Wrong", 200);
  console.log(" Result ",videosList)
  return ApiResponse.success(res, videosList);
};


module.exports = {
  create,
  getAllVideo,
  getVideo,
  deleteVideo,
  updateVideo,
  inactiveVideo,
  searchVideo
};
