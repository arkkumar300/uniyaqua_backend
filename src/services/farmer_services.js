const jwt = require("jsonwebtoken");
const Farmer = require("../models/farmer");
const FarmerAndTest = require("../models/farmerandtest");
const User = require("../models/user");
const ApiResponse = require("../configs/api_response");
const SERECT_KEY = require("../helpers/constants");
const uploadToCloud = require("../configs/uploadToCloud");
const { Op } = require("sequelize");

const createFarmer = async (req, res) => {
  let user = await Farmer.findOne({
    where: { phoneNumber: req.body.phoneNumber },
    include: [User],
    order: [["createdAt", "DESC"]],
  });
  if (!user) {
    let user = await Farmer.create({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      state: req.body.state,
      district: req.body.district,
      area: req.body.area,
      cultureType: req.body.cultureType,
      userId: req.user.id,
    });
    let farmerExists = await Farmer.findOne({
      where: {
        userId: req.user.id,
      },
    });
    if (!farmerExists) {
      let testAndFarmer = await FarmerAndTest.create({
        userId: req.user.id,
        farmerId: user.id,
      });
    }

    ApiResponse.success(res, {
      farmer: user,
    });
  } else {
    ApiResponse.farmerExist(res, {
      farmer: user,
    });
  }
};

const deleteFarmer = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "Farmer Id is not Found", 400);

  let user = await Farmer.destroy({
    where: { id: id },
  });
  if (user == 0) return ApiResponse.error(res, "No Farmer with this id", 404);

  return ApiResponse.success(res, user);
};

const findFarmerFromPhone = async (req, res) => {
  try {
    const { userId, phone } = req.params;
    if (!phone)
      return ApiResponse.error(res, "Farmer Phone is not Provided", 400);
    let farmers = await Farmer.findAll({
      where: {
        phoneNumber: {
          [Op.like]: `%${phone}%`,
        },
      },
      include: [
        {
          model: FarmerAndTest,
          attributes: [],
          where: { userId: userId },
        },
      ],
    });

    return ApiResponse.success(res, farmers);
  } catch (error) {
    return ApiResponse.error(res, "Failed to retrieve farms", error);
  }
};

const findFarmerAll = async (req, res) => {
  try {
    const { userId } = req.params;
    let userFarms = await Farmer.findAll({
      where: { userId: userId },
    });

    return ApiResponse.success(res, userFarms);
  } catch (error) {
    return ApiResponse.error(res, "Failed to retrieve farms", error);
  }
};
const findMyAllFarmer = async (req, res) => {
  try {
    const { userId } = req.params;

    const farmers = await Farmer.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: FarmerAndTest,
          attributes: [],
          where: {
            userId,
          },
          required: false,
        },
      ],
    });
    return ApiResponse.success(res, farmers);
  } catch (error) {
    return ApiResponse.error(res, "Failed to retrieve farms", error);
  }
};

// const findMyAllFarmer = async (req, res) => {
//   console.log("findMyAllFarmer");
//   try {
//     const { userId } = req.params;
//     // let userFarms = await Farmer.findAll({
//     //   // where: { userId: userId },
//     // });
//     let userFarms = await FarmerAndTest.findAll({
//       include: [
//         {
//           model: Farmer,
//         },
//       ],
//       // where: { userId: userId },
//     });

//     return ApiResponse.success(res, userFarms);
//   } catch (error) {
//     return ApiResponse.error(res, "Failed to retrieve farms", error);
//   }
// };
const findFarmerAllAdmin = async (req, res) => {
  try {
    let userFarms = await Farmer.findAll({});

    return ApiResponse.success(res, userFarms);
  } catch (error) {
    return ApiResponse.error(res, "Failed to retrieve farms", error);
  }
};
const findFarmer = async (req, res) => {
  const { id } = req.params;
  let user = await Farmer.findByPk(id, {
    include: [User],
  });
  if (!user) return ApiResponse.error(res, "No Farmer with This Id", 404);

  return ApiResponse.success(res, user);
};

const filterFarmer = async (req, res) => {
  try {
    const { userId, cultureType } = req.params;
    let userFarms = await Farmer.findAll({
      where: {
        userId,
        cultureType: cultureType,
      },
      include: [
        {
          model: FarmerAndTest,
          attributes: [],
          where: { userId: userId },
          required:false
        },
      ],
    });
    return ApiResponse.success(res, userFarms);
  } catch (error) {
    return ApiResponse.error(res, "Failed to retrieve farms", error);
  }
};

module.exports = {
  createFarmer,
  deleteFarmer,
  findFarmerAll,
  findFarmer,
  findFarmerFromPhone,
  filterFarmer,
  findFarmerAllAdmin,
  findMyAllFarmer,
};
