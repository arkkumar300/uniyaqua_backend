const ApiResponse = require("../../configs/api_response");
const FishTest = require("../../models/sample/fishTest");
const Tank = require("../../models/tank");
const Farmer = require("../../models/farmer");
const User = require("../../models/user");
const { Op } = require("sequelize");
const AllTest = require("../../models/sample/test");
const { Sequelize } = require("sequelize");

const createFish = async (req, res) => {
  const { body } = req;
  console.log(body);
  let news = await FishTest.create(body);

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

const getAllFish = async (req, res) => {
  const { user_id } = req.params;
  let newsList = await FishTest.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: AllTest,
        where: { user_id: user_id },
      },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);
  // var trueConditionsFishTest = newsList.map((record) => {
  //   const trueConditionsForRecord = {
  //     // id: record.id,
  //   };

  //   if (record.bodyColour == "Dark") {
  //     trueConditionsForRecord.bodyColour = record.bodyColour;
  //   }

  //   if (record.bodyTexture == "Wounded") {
  //     trueConditionsForRecord.bodyTexture = record.bodyTexture;
  //   }

  //   if (record.mucus == "Heavy") {
  //     trueConditionsForRecord.mucus = record.mucus;
  //   }

  //   if (record.eyes == "Popped Out") {
  //     trueConditionsForRecord.eyes = record.eyes;
  //   }

  //   if (record.finsColour !== "Damaged") {
  //     trueConditionsForRecord.finsColour = record.finsColour;
  //   }

  //   if (record.gills == "Damaged") {
  //     trueConditionsForRecord.gills = record.gills;
  //   }

  //   if (record.intestines == "Fluids") {
  //     trueConditionsForRecord.intestines = record.intestines;
  //   }

  //   if (record.internalBloodLumps == "Severe") {
  //     trueConditionsForRecord.internalBloodLumps = record.internalBloodLumps;
  //   }

  //   if (record.liver == "Damaged") {
  //     trueConditionsForRecord.liver = record.liver;
  //   }

  //   if (record.gut == "Puss") {
  //     trueConditionsForRecord.gut = record.gut;
  //   }

  //   if (record.gallBladder == "Damaged") {
  //     trueConditionsForRecord.gallBladder = record.gallBladder;
  //   }

  //   if (record.redDisease == "Severe") {
  //     trueConditionsForRecord.redDisease = record.redDisease;
  //   }

  //   if (record.ulcerativeDropsy == "Severe") {
  //     trueConditionsForRecord.ulcerativeDropsy = record.ulcerativeDropsy;
  //   }

  //   if (record.abdominalDropsy == "Severe") {
  //     trueConditionsForRecord.abdominalDropsy = record.abdominalDropsy;
  //   }

  //   if (record.bodyColumnaris == "Severe") {
  //     trueConditionsForRecord.bodyColumnaris = record.bodyColumnaris;
  //   }

  //   if (record.gillColumnaris == "Severe") {
  //     trueConditionsForRecord.gillColumnaris = record.gillColumnaris;
  //   }

  //   if (record.epizooticUlcerativeSyndrome == "Severe") {
  //     trueConditionsForRecord.epizooticUlcerativeSyndrome =
  //       record.epizooticUlcerativeSyndrome;
  //   }

  //   if (record.dactylogyrus == "Severe") {
  //     trueConditionsForRecord.dactylogyrus = record.dactylogyrus;
  //   }

  //   if (record.gyrodactylus == "Severe") {
  //     trueConditionsForRecord.gyrodactylus = record.gyrodactylus;
  //   }

  //   if (record.trichodina == "Severe") {
  //     trueConditionsForRecord.trichodina = record.trichodina;
  //   }

  //   if (record.myxobolus == "Severe") {
  //     trueConditionsForRecord.myxobolus = record.myxobolus;
  //   }

  //   if (record.anchorWormORLernaea == "Severe") {
  //     trueConditionsForRecord.anchorWormORLernaea = record.anchorWormORLernaea;
  //   }

  //   if (record.argulus == "Severe") {
  //     trueConditionsForRecord.argulus = record.argulus;
  //   }

  //   if (record.finRotORTailrot == "Severe") {
  //     trueConditionsForRecord.finRotORTailrot = record.finRotORTailrot;
  //   }

  //   if (record.hemorrhagicSepticemia == "Severe") {
  //     trueConditionsForRecord.hemorrhagicSepticemia =
  //       record.hemorrhagicSepticemia;
  //   }
  //   // Create the status field with the JSON-like content
  //   record.status = trueConditionsForRecord;
  //   return record;
  // });
  return ApiResponse.success(res, newsList);
};
const getFish = async (req, res) => {
  const { id } = req.params;
  let newsList = await FishTest.findByPk(id, {
    include: [
      { model: AllTest },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);
  // var trueConditionsFishTest = (record) => {
  //   const trueConditionsForRecord = {
  //     // id: record.id,
  //   };

  //     if (record.bodyColour == "Dark") {
  //       trueConditionsForRecord.bodyColour = record.bodyColour;
  //     }

  //     if (record.bodyTexture == "Wounded") {
  //       trueConditionsForRecord.bodyTexture = record.bodyTexture;
  //     }

  //     if (record.mucus == "Heavy") {
  //       trueConditionsForRecord.mucus = record.mucus;
  //     }

  //     if (record.eyes == "Popped Out") {
  //       trueConditionsForRecord.eyes = record.eyes;
  //     }

  //     if (record.finsColour !== "Damaged") {
  //       trueConditionsForRecord.finsColour = record.finsColour;
  //     }

  //     if (record.gills == "Damaged") {
  //       trueConditionsForRecord.gills = record.gills;
  //     }

  //     if (record.intestines == "Fluids") {
  //       trueConditionsForRecord.intestines = record.intestines;
  //     }

  //     if (record.internalBloodLumps == "Severe") {
  //       trueConditionsForRecord.internalBloodLumps = record.internalBloodLumps;
  //     }

  //     if (record.liver == "Damaged") {
  //       trueConditionsForRecord.liver = record.liver;
  //     }

  //     if (record.gut == "Puss") {
  //       trueConditionsForRecord.gut = record.gut;
  //     }

  //     if (record.gallBladder == "Damaged") {
  //       trueConditionsForRecord.gallBladder = record.gallBladder;
  //     }

  //     if (record.redDisease == "Severe") {
  //       trueConditionsForRecord.redDisease = record.redDisease;
  //     }

  //     if (record.ulcerativeDropsy == "Severe") {
  //       trueConditionsForRecord.ulcerativeDropsy = record.ulcerativeDropsy;
  //     }

  //     if (record.abdominalDropsy == "Severe") {
  //       trueConditionsForRecord.abdominalDropsy = record.abdominalDropsy;
  //     }

  //     if (record.bodyColumnaris == "Severe") {
  //       trueConditionsForRecord.bodyColumnaris = record.bodyColumnaris;
  //     }

  //     if (record.gillColumnaris == "Severe") {
  //       trueConditionsForRecord.gillColumnaris = record.gillColumnaris;
  //     }

  //     if (record.epizooticUlcerativeSyndrome == "Severe") {
  //       trueConditionsForRecord.epizooticUlcerativeSyndrome =
  //         record.epizooticUlcerativeSyndrome;
  //     }

  //     if (record.dactylogyrus == "Severe") {
  //       trueConditionsForRecord.dactylogyrus = record.dactylogyrus;
  //     }

  //     if (record.gyrodactylus == "Severe") {
  //       trueConditionsForRecord.gyrodactylus = record.gyrodactylus;
  //     }

  //     if (record.trichodina == "Severe") {
  //       trueConditionsForRecord.trichodina = record.trichodina;
  //     }

  //     if (record.myxobolus == "Severe") {
  //       trueConditionsForRecord.myxobolus = record.myxobolus;
  //     }

  //     if (record.anchorWormORLernaea == "Severe") {
  //       trueConditionsForRecord.anchorWormORLernaea = record.anchorWormORLernaea;
  //     }

  //     if (record.argulus == "Severe") {
  //       trueConditionsForRecord.argulus = record.argulus;
  //     }

  //     if (record.finRotORTailrot == "Severe") {
  //       trueConditionsForRecord.finRotORTailrot = record.finRotORTailrot;
  //     }

  //     if (record.hemorrhagicSepticemia == "Severe") {
  //       trueConditionsForRecord.hemorrhagicSepticemia =
  //         record.hemorrhagicSepticemia;
  //     }
  //   // Create the status field with the JSON-like content
  //   record.status = trueConditionsForRecord;
  //   return record;
  // };
  return ApiResponse.success(res, newsList);
};

const deleteFish = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "News ID Not Found", 400);
  let newsList = await FishTest.destroy({ where: { id: id } });

  if (newsList == 0) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const updateFish = async (req, res) => {
  const { id } = req.params;
  var { body } = req;

  if (!id) return ApiResponse.error(res, "News ID Not Found", 400);
  let newsList = await FishTest.update(body, {
    where: { id: id },
  });

  if (!newsList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, newsList);
};

const getAllComplexFish = async (req, res) => {
  let newsList = await FishTest.findAll({
    where: {
      diagnosedProblemAndDisease: {
        [Sequelize.Op.not]: null,
      },
      // [Op.or]: [
      //   { bodyColour: { [Op.eq]: "Dark" } },
      //   { bodyTexture: { [Op.eq]: "Wounded" } },
      //   { mucus: { [Op.eq]: "Heavy" } },
      //   { eyes: { [Op.eq]: "Popped Out" } },
      //   { finsColour: { [Op.eq]: "Damaged" } },
      //   { gills: { [Op.eq]: "Damaged" } },
      //   { intestines: { [Op.eq]: "Fluids" } },
      //   { internalBloodLumps: { [Op.eq]: "Severe" } },
      //   { liver: { [Op.eq]: "Damaged" } },
      //   { gut: { [Op.eq]: "Puss" } },
      //   { gallBladder: { [Op.eq]: "Damaged" } },
      //   { redDisease: { [Op.eq]: "Severe" } },
      //   { ulcerativeDropsy: { [Op.eq]: "Severe" } },
      //   { abdominalDropsy: { [Op.eq]: "Severe" } },
      //   { bodyColumnaris: { [Op.eq]: "Severe" } },
      //   { gillColumnaris: { [Op.eq]: "Severe" } },
      //   { epizooticUlcerativeSyndrome: { [Op.eq]: "Severe" } },
      //   { dactylogyrus: { [Op.eq]: "Severe" } },
      //   { gyrodactylus: { [Op.eq]: "Severe" } },
      //   { trichodina: { [Op.eq]: "Severe" } },
      //   { myxobolus: { [Op.eq]: "Severe" } },
      //   { anchorWormORLernaea: { [Op.eq]: "Severe" } },
      //   { argulus: { [Op.eq]: "Severe" } },
      //   { finRotORTailrot: { [Op.eq]: "Severe" } },
      //   { hemorrhagicSepticemia: { [Op.eq]: "Severe" } },
      // ],
    },
    order: [["createdAt", "DESC"]],
    include: [
      { model: AllTest },
      { model: Tank, include: [{ model: Farmer, include: User }] },
    ],
  });
  // var trueConditionsFishTest = newsList.map((record) => {
  //   const trueConditionsForRecord = {
  //     // id: record.id,
  //   };

  //     if (record.bodyColour == "Dark") {
  //       trueConditionsForRecord.bodyColour = record.bodyColour;
  //     }

  //     if (record.bodyTexture == "Wounded") {
  //       trueConditionsForRecord.bodyTexture = record.bodyTexture;
  //     }

  //     if (record.mucus == "Heavy") {
  //       trueConditionsForRecord.mucus = record.mucus;
  //     }

  //     if (record.eyes == "Popped Out") {
  //       trueConditionsForRecord.eyes = record.eyes;
  //     }

  //     if (record.finsColour !== "Damaged") {
  //       trueConditionsForRecord.finsColour = record.finsColour;
  //     }

  //     if (record.gills == "Damaged") {
  //       trueConditionsForRecord.gills = record.gills;
  //     }

  //     if (record.intestines == "Fluids") {
  //       trueConditionsForRecord.intestines = record.intestines;
  //     }

  //     if (record.internalBloodLumps == "Severe") {
  //       trueConditionsForRecord.internalBloodLumps = record.internalBloodLumps;
  //     }

  //     if (record.liver == "Damaged") {
  //       trueConditionsForRecord.liver = record.liver;
  //     }

  //     if (record.gut == "Puss") {
  //       trueConditionsForRecord.gut = record.gut;
  //     }

  //     if (record.gallBladder == "Damaged") {
  //       trueConditionsForRecord.gallBladder = record.gallBladder;
  //     }

  //     if (record.redDisease == "Severe") {
  //       trueConditionsForRecord.redDisease = record.redDisease;
  //     }

  //     if (record.ulcerativeDropsy == "Severe") {
  //       trueConditionsForRecord.ulcerativeDropsy = record.ulcerativeDropsy;
  //     }

  //     if (record.abdominalDropsy == "Severe") {
  //       trueConditionsForRecord.abdominalDropsy = record.abdominalDropsy;
  //     }

  //     if (record.bodyColumnaris == "Severe") {
  //       trueConditionsForRecord.bodyColumnaris = record.bodyColumnaris;
  //     }

  //     if (record.gillColumnaris == "Severe") {
  //       trueConditionsForRecord.gillColumnaris = record.gillColumnaris;
  //     }

  //     if (record.epizooticUlcerativeSyndrome == "Severe") {
  //       trueConditionsForRecord.epizooticUlcerativeSyndrome =
  //         record.epizooticUlcerativeSyndrome;
  //     }

  //     if (record.dactylogyrus == "Severe") {
  //       trueConditionsForRecord.dactylogyrus = record.dactylogyrus;
  //     }

  //     if (record.gyrodactylus == "Severe") {
  //       trueConditionsForRecord.gyrodactylus = record.gyrodactylus;
  //     }

  //     if (record.trichodina == "Severe") {
  //       trueConditionsForRecord.trichodina = record.trichodina;
  //     }

  //     if (record.myxobolus == "Severe") {
  //       trueConditionsForRecord.myxobolus = record.myxobolus;
  //     }

  //     if (record.anchorWormORLernaea == "Severe") {
  //       trueConditionsForRecord.anchorWormORLernaea = record.anchorWormORLernaea;
  //     }

  //     if (record.argulus == "Severe") {
  //       trueConditionsForRecord.argulus = record.argulus;
  //     }

  //     if (record.finRotORTailrot == "Severe") {
  //       trueConditionsForRecord.finRotORTailrot = record.finRotORTailrot;
  //     }

  //     if (record.hemorrhagicSepticemia == "Severe") {
  //       trueConditionsForRecord.hemorrhagicSepticemia =
  //         record.hemorrhagicSepticemia;
  //     }
  //   // Create the status field with the JSON-like content
  //   record.status = trueConditionsForRecord;

  //   return record;
  // });

  return ApiResponse.success(res, newsList);
};

const completeFish = async (req, res) => {
  const { id } = req.params;
  var { body } = req;
  if (!id) return ApiResponse.error(res, "Fish ID Not Found", 400);
  let newsList = await FishTest.update(
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
module.exports = {
  createFish,
  getAllFish,
  getFish,
  deleteFish,
  updateFish,
  getAllComplexFish,
  completeFish,
};
