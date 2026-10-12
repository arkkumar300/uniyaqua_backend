const ApiResponse = require("../configs/api_response");
const Topic = require("../models/topic");
const News = require("../models/news");
const Fuse = require("fuse.js");
const uploadToCloud = require("../configs/uploadToCloud");

const create = async (req, res) => {
  //Creating News
  const { url } = await uploadToCloud(req.file?.filename);
  console.log(url, req.file);
  let news = await News.create({
    title: req.body.title,
    description: req.body.description,
    thumbnail: url,
    userId: req.user.id,
  });

  if (!news) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, news);
};

const getAllNews = async (req, res) => {
  // await Book.sync({ alter: true });
  let newsList = await News.findAll({
    where: { status: "1" },
    order: [["createdAt", "DESC"]],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};
const getNew = async (req, res) => {
  console.log("1");
  const { id } = req.params;
  // await Book.sync({ alter: true });
  let newsList = await News.findOne({ where: { id: id } });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const deleteNews = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "News ID Not Found", 400);
  let newsList = await News.destroy({ where: { id: id } });

  if (newsList == 0) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const updateNews = async (req, res) => {
  const id = req.params.id;

  console.log("These is the updated ", req.params.id);
  var { body } = req;
  console.log("these is the body");
  console.log(body);
  if (req?.files?.length > 0) {
    const { url } = await uploadToCloud(req.files[0]?.filename);
    body.thumbnail = url;
  }

  if (!id) return ApiResponse.error(res, "News ID Not Found", 400);
  let newsList = await News.update(body, {
    where: { id: id },
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};
const searchNews = async (req, res) => {
  console.log(" NEws Called ");
  const { search } = req.query;
  if (!search) return ApiResponse.error(res, "News ID Not Found", 400);
  let newsList = await News.findAll({
    where: {
      status: "1",
    },
    order: [["createdAt", "DESC"]],
  });
  let newsArray = [];
  newsList.map((news) => newsArray.push(news.get()));
  let fuse = new Fuse(newsArray, { keys: ["title"], includeScore: false });
  const searchedResult = fuse.search(search);

  if (!searchedResult)
    return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(
    res,
    searchedResult.map((sl) => sl.item)
  );
};
module.exports = {
  create,
  getAllNews,
  getNew,
  deleteNews,
  updateNews,
  searchNews,
};
