const ApiResponse = require("../configs/api_response");
const State = require("../models/state");
const District = require("../models/district")
const Fuse = require("fuse.js");

const createState = async (req, res) => {
  let book = await State.create(req.body);
  
  if (!book) return ApiResponse.error(res, "Something Went Wrong", 200);
  
  return ApiResponse.success(res, book);
};

const getAllState = async (req, res) => {
  let bookList = await State.findAll({
    order: [["createdAt", "DESC"]],
  });

  if (!bookList) return ApiResponse.error(res, "Something Went Wrong", 200);
  
  return ApiResponse.success(res, bookList);
};

const deleteState = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "State ID Not Found", 400);
  
  let bookList = await State.destroy({
    where: {
      id: id,
    },
  });

  if (bookList == 0)
    return ApiResponse.error(res, "No State with this Id ", 200);

  return ApiResponse.success(res, bookList);
};

const getState = async (req, res) => {
  const { id } = req.params;

  if (!id) return ApiResponse.error(res, "State ID Not Found", 400);
  let bookList = await State.findOne({ where: { id: id } });

  if (!bookList) return ApiResponse.error(res, "No State with this Id ", 200);

  return ApiResponse.success(res, bookList);
};

const updateState = async (req, res) => {
  var body = req.body;
  const { id } = req.params;

  if (!id) return ApiResponse.error(res, "State ID Not Found", 400);
  let booksList = await State.update(body, {
    where: { id: id },
  });

  if (!booksList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, booksList);
};

const getAllDistrictFromState = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "State ID Not Found", 400);
  let bookList = await District.findAll({ where: { stateId: id },include:[State] });

  if (!bookList) return ApiResponse.error(res, "No District associated with this  State", 200);

  return ApiResponse.success(res, bookList);
};

const createDistrict = async (req, res) => {
  let book = await District.create(req.body);

  if (!book) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, book);
};

const getAllDistrict = async (req, res) => {
  let bookList = await District.findAll({
    include: [State],
    order: [["createdAt", "DESC"]],
  });

  if (!bookList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, bookList);
};

const deleteDistrict = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "District ID Not Found", 400);
  let bookList = await District.destroy({
    where: {
      id: id,
    },
  });

  if (bookList == 0)
    return ApiResponse.error(res, "No District with this Id ", 200);

  return ApiResponse.success(res, bookList);
};

const getDistrict = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "District ID Not Found", 400);
  let bookList = await District.findOne({ where: { id: id } ,include:[State]});

  if (!bookList) return ApiResponse.error(res, "No District with this Id ", 200);

  return ApiResponse.success(res, bookList);
};
const updateDistrict = async (req, res) => {
  var body = req.body;
  const { id } = req.params;

  if (!id) return ApiResponse.error(res, "District ID Not Found", 400);
  let booksList = await District.update(body, {
    where: { id: id },
  });

  if (!booksList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, booksList);
};

module.exports = {
  createState,
  getAllState,
  getState,
  deleteState,
  updateState,
  createDistrict,
  getAllDistrict,
  getDistrict,
  deleteDistrict,
  updateDistrict,
  getAllDistrictFromState
};
