const ApiResponse = require("../configs/api_response");
const Problem = require("../models/treatment/problem");
const Sector = require("../models/treatment/sector");
const Treatment = require("../models/treatment/treatment");
const TreatmentFramer = require("../models/treatment/treatment_farmer");
const UserTreatment = require("../models/treatment/user_treatment");
const uploadToCloud = require("../configs/uploadToCloud");
const User = require("../models/user");
// SECTOR
const createSector = async (req, res) => {
  const { url } = await uploadToCloud(req.file?.filename);
  let sector = await Sector.create({
    name: req.body.name,
    image: url || 'https://static.vecteezy.com/system/resources/thumbnails/048/829/173/small/golden-ornamental-fish-isolated-on-white-background-free-photo.jpg',
  });

  if (!sector) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, sector);
};
const getAllSectors = async (req, res) => {

  let sectors = await Sector.findAll({
    where: { status: "1" },
  });

  if (!sectors) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, sectors);
};

const updateSector = async (req, res) => {
  const { id } = req.params;

  let [sectors, b] = await Sector.update(req.body, {
    where: { id: id },
    returning: true,
  });

  if (sectors === 0) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, b);
};

const deleteSector = async (req, res) => {
  const { id } = req.params;
  let sectors = await Sector.destroy({
    where: {
      id: id,
    },
  });
  if (sectors === 0) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, sectors);
};
// PROBLEM
const createProblem = async (req, res) => {
  let problem = await Problem.create({
    name: req.body.name,
    sectorId: req.body.sectorId,
  });

  if (!problem) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, problem);
};
const getAllProblems = async (req, res) => {
  const { sectorId } = req.query;
  let problems = await Problem.findAll({
    where: { status: "1" },
    include: [Sector],
    order: [["createdAt", "DESC"]],
  });

  if (!problems) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, problems);
};

const getProblemBySector = async (req, res) => {
  const { id } = req.params;
  let problems = await Problem.findAll({
    where: { sectorId: id },
    include: [Sector],
    order: [["createdAt", "DESC"]],
  });

  if (!problems) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, problems);
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;
  let problem = await Problem.destroy({
    where: {
      id: id,
    },
  });

  if (problem === 0) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, problem);
};
// TREATMENT
const createTreatment = async (req, res) => {
  const imageUrls = new Array();
  var isNoImage = false;
  if (!req.files) {
    isNoImage = true;

  } else {
    const imageUrl1 = req.files?.imageUrl1[0];
    const imageUrl2 = req.files?.imageUrl2[0];
    const imageUrl3 = req.files?.imageUrl3[0];

    const files = [imageUrl1, imageUrl2, imageUrl3];
    for (const file of files) {
      const { url } = await uploadToCloud(file?.filename);
      imageUrls.push(url);
    }
  }

  let treatment = await Treatment.create({
    name: req.body.name,
    description: req.body.description,
    imageUrl1: imageUrls?.length == 0 ? null : imageUrls[0],
    imageUrl2: imageUrls?.length == 0 ? null : imageUrls[1],
    imageUrl3: imageUrls?.length == 0 ? null : imageUrls[2],
    problemId: req.body.problemId,
  });
  console.log(treatment.id, req.user);
  await UserTreatment.create({
    treatmentId: treatment.id,
    userId: req.user.id,
  });

  if (!treatment) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, treatment);
};

const updateTreatment = async (req, res) => {
  const imageUrls = [];
  const id = req.params.treatmentId;

  let isNoImage = false;
  if (!req.files) {
    isNoImage = true;
  } else {
    const imageUrl1 = req.files?.imageUrl1?.[0];
    const imageUrl2 = req.files?.imageUrl2?.[0];
    const imageUrl3 = req.files?.imageUrl3?.[0];
    const files = [imageUrl1, imageUrl2, imageUrl3];

    for (const file of files) {
      if (file) {
        const { url } = await uploadToCloud(file.filename);
        imageUrls.push(url);
      } else {
        imageUrls.push(null);
      }
    }
  }

  try {
    // Find the existing treatment by ID
    let treatment = await Treatment.findByPk(id);

    if (!treatment) {
      return ApiResponse.error(res, "Treatment not found", 404);
    }

    treatment.name = req.body.name || treatment.name;
    treatment.description = req.body.description || treatment.description;
    treatment.problemId = req.body.problemId || treatment.problemId;

    // Update image URLs only if new images were uploaded
    treatment.imageUrl1 = imageUrls[0] || treatment.imageUrl1;
    treatment.imageUrl2 = imageUrls[1] || treatment.imageUrl2;
    treatment.imageUrl3 = imageUrls[2] || treatment.imageUrl3;

    await treatment.save();

    return ApiResponse.success(res, treatment);
  } catch (error) {
    console.error("Error updating treatment:", error);
    return ApiResponse.error(res, "Something went wrong", 500);
  }
};

const getAllTreatments = async (req, res) => {
  let treatments = await Treatment.findAll({
    where: { status: "1" },
    order: [["createdAt", "DESC"]],
    include: [{ model: Problem, include: Sector }],
  });

  if (!treatments) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, treatments);
};

const getAllTreatmentsForAdmin = async (req, res) => {
  console.log("with status called ");
  console.log("i am called ");
  const status = req.params.status;
  let treatments = await Treatment.findAll({
    where: { status: status },
    order: [["createdAt", "DESC"]],
    include: [{ model: Problem, include: Sector }],
  });

  if (!treatments) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, treatments);
};

const deleteTreatment = async (req, res) => {
  const { id } = req.params;
  let treatments = await Treatment.destroy({
    where: {
      id: id,
    },
  });
  if (treatments === 0)
    return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, treatments);
};

const getTreatments = async (req, res) => {

  const { problemId } = req.params;
  let treatments = await Treatment.findAll({
    where: { status: "1", problemId: problemId },
    order: [["createdAt", "DESC"]],
    include: [{ model: Problem, include: Sector }],
  });

  if (!treatments) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, treatments);
};
const importTreatment = async (req, res) => {
  const { treatmentId } = req.query;
  let userTreatment = await UserTreatment.findOne({
    where: {
      treatmentId: treatmentId,
      userId: req.body.user.id,
    },
  });

  if (userTreatment) return ApiResponse.error(res, "Already imported", 200);

  const updatedProduct = await Treatment.increment("importCount", {
    by: 1,
    where: { id: treatmentId },
  });

  let newUserTreatment = await UserTreatment.create({
    treatmentId: treatmentId,
    userId: req.body.user.id,
  });
  if (!newUserTreatment)
    return ApiResponse.error(res, "Something Went Wrong", 200);
  return ApiResponse.success(res, newUserTreatment);
};

const createTreatmentFramer = async (req, res) => {
  let treatmentFramer = await TreatmentFramer.create({
    treatmentId: req.body.treatmentId,
    nameOne: req.body.nameOne,
    tankOne: req.body.tankOne,
    phoneOne: req.body.phoneOne,
    nameTwo: req.body.nameTwo,
    tankTwo: req.body.tankTwo,
    phoneTwo: req.body.phoneTwo,
    nameThree: req.body.nameThree,
    tankThree: req.body.tankThree,
    phoneThree: req.body.phoneThree,
  });

  if (!treatmentFramer)
    return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, treatmentFramer);
};

const approveFarmer = async (req, res) => {
  const { id } = req.params;
  let treatmentFramer = await TreatmentFramer.findByPk(id);
  const { treatmentId } = treatmentFramer;
  let [sectors, b] = await Treatment.update(
    { status: 2 },
    { where: { id: treatmentId }, returning: true }
  );
  await treatmentFramer.update({ status: 2 });

  if (sectors === 0) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, b);
};

const deleteFarmer = async (req, res) => {
  const { id } = req.params;
  let treatment = await TreatmentFramer.findByPk(id);
  const { treatmentId } = treatment;
  let [sectors, b] = await Treatment.update(
    { status: 1 },
    { where: { id: treatmentId }, returning: true }
  );
  let treatmentFramer = await TreatmentFramer.destroy({
    where: {
      id: id,
    },
  });

  if (treatmentFramer == 0 || sectors == 0)
    return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, treatmentFramer);
};

const getFarmers = async (req, res) => {
  const { id } = req.params;
  let treatmentFramer = await TreatmentFramer.findByPk(id, {
    include: [
      { model: Treatment, include: [{ model: Problem, include: Sector }] },
    ],
  });
  if (!treatmentFramer)
    return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, treatmentFramer);
};

const getProblemByFarmer = async (req, res) => {
  const { id } = req.params;
  const treatmentFarmers = await TreatmentFramer.findAll({
    include: [
      {
        model: Treatment,
        where: { problemId: id },
        include: [
          {
            model: Problem,
            include: Sector,
          },
        ],
      },
    ],
  });

  if (!treatmentFarmers)
    return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, treatmentFarmers);
};

const getAllFarmers = async (req, res) => {
  let treatmentFramer = await TreatmentFramer.findAll({
    include: [
      { model: Treatment, include: [{ model: Problem, include: Sector }] },
    ],
  });

  if (!treatmentFramer)
    return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, treatmentFramer);
};
const findMyTreatments = async (req, res) => {
  // console.log(req.body, "Welcome");
  let userTreatments = await UserTreatment.findAll({
    where: { status: "1", userId: req.body.user.id },
    include: [
      { model: Treatment, include: [{ model: Problem, include: Sector }] },
    ],
    order: [["createdAt", "DESC"]],
  });
  let treatments = new Array();
  userTreatments.map((userTreatment) =>
    treatments.push(userTreatment.treatment)
  );

  if (!treatments) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, treatments);
};

const getTreatmentBySector = async (req, res) => {
  const { id } = req.params;
  console.log(" Get Treatment from Sector ID ", id);
  const treatmentFarmers = await Treatment.findAll({
    include: [
      {
        model: Problem,
        where: { sectorId: id },
        include: [Sector],
      },
    ],
  });

  if (!treatmentFarmers)
    return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, treatmentFarmers);
};
const getMyTreatmentBySector = async (req, res) => {
  const { id } = req.params;
  console.log(" Get Treatment from Sector ID ", id);
  const treatmentFarmers = await UserTreatment.findAll({
    include: [
      {
        model: Treatment,
        include: [
          {
            model: Problem,
            where: { sectorId: id },
            include: Sector,
          },
        ],
      },
    ],
    where: { status: "1", userId: req.body.user.id },
  });

  let treatments = new Array();
  treatmentFarmers.map((userTreatment) => {
    if (userTreatment.treatment) {
      treatments.push(userTreatment.treatment);
    }
  });

  if (!treatments) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, treatments);
};

module.exports = {
  createSector,
  getAllSectors,
  deleteProblem,
  getTreatments,
  updateSector,
  getFarmers,
  getProblemBySector,
  createProblem,
  getAllProblems,
  createTreatment,
  getAllTreatments,
  importTreatment,
  deleteTreatment,
  getAllFarmers,
  approveFarmer,
  deleteFarmer,
  deleteSector,
  deleteProblem,
  getProblemByFarmer,
  createTreatmentFramer,
  findMyTreatments,
  getTreatmentBySector,
  getMyTreatmentBySector,
  updateTreatment,
  getAllTreatmentsForAdmin,
};
