const ApiResponse = require("../configs/api_response");
const LabAssistant = require("../models/labAssistant");
const User = require("../models/user");
const Fuse = require("fuse.js");

const create = async (req, res) => {
  const {body} = req;
  let news = await LabAssistant.create(body);

  if (!news) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, news);
};

const getAllAssistants = async (req, res) => {
  const {userId} = req.query;
  const where =  userId ? { userId} : {  }
  let newsList = await LabAssistant.findAll({
    where,
    include: [{model:User}],
    order: [["createdAt", "DESC"]]
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const getAssistant = async (req, res) => {
  const {id} = req.params
  let newsList = await LabAssistant.findByPk(id,{
    include: [{model:User}],    
  });

  if (!newsList) return ApiResponse.error(res, "Lab Assistant not found!", 404);

  return ApiResponse.success(res, newsList);
};

const deleteAssistant = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "Assistant ID Not Found", 400);
  let newsList = await LabAssistant.destroy({where:{id:id}})

  if (newsList == 0) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const updateAssistant= async (req, res) => {
  const { id } = req.params;
  console.log("labAss.ID::",id);
  var {body} = req

  if (!id) return ApiResponse.error(res, "Lab Assistant ID Not Found", 400);
  let newsList = await LabAssistant.update(
    body,
    {
      where: { id: id },
    }
  );

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res,newsList);
};

const getPendingAssistants = async (req, res) => {
  const {userId} = req.query
  const where =  userId ? { status:"Pending" , userId} : { status:"Pending" }
  let newsList = await LabAssistant.findAll({
    where,  
    include: [{model:User}],
    order: [["createdAt", "DESC"]]
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

module.exports = {
  create,
  getAllAssistants,
  getAssistant,
  deleteAssistant,
  updateAssistant,
  getPendingAssistants,
};
