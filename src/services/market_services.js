const ApiResponse = require("../configs/api_response");
const MarketType = require("../models/market/market_type");
const MarketZone = require("../models/market/market_zone");
const Market = require("../models/market/market");
const MarketTypeData = require("../models/market/market_type_data");
const Sequelize = require("sequelize");

const fetchMarketStatus = async (market) => {
  try {
    const marketTypes = await MarketTypeData.findAll({
      where: {
        marketTypeId: market.id,
      },
      include: MarketType,
    });

    market.status = marketTypes;
  } catch (error) {
    console.error("Error:", error);
    // Handle errors if needed
  }
};

const getAllZones = async (req, res) => {
  const { marketId } = req.query;
  if (!marketId) return ApiResponse.error(res, "Market ID Not Found", 200);
  //Creating Video
  let zones = await MarketZone.findAll({
    where: { marketId },
    include: MarketType,
  });

  if (!zones) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, zones);
};

const createMarket = async (req, res) => {
  const { name } = req.body;
  const existingMarketType = await Market.findOne({
    where: {
      name,
    },
  });

  if (existingMarketType) {
    return ApiResponse.error(res, "Market Name already exist", 400);
  }
  if (!name) return ApiResponse.error(res, "Name Not Added", 200);
  //Creating Video
  let zones = await Market.create({
    name,
  });

  if (!zones) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, zones);
};
const createMarketZone = async (req, res) => {
  const { name, marketId } = req.body;
  const existingMarketType = await MarketZone.findOne({
    where: {
      name,
      marketId,
    },
  });

  if (existingMarketType) {
    return ApiResponse.error(res, "Market Zone Name already exist", 400);
  }
  //Creating Video
  let zones = await MarketZone.create({
    name,
    marketId,
  });

  if (!zones) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, zones);
};
const createMarketType = async (req, res) => {
  console.log(req.body);
  const { name, marketZoneId, data } = req.body;
  // const existingMarketType = await MarketType.findOne({
  //   where: {
  //     name,
  //     marketZoneId,
  //   },
  // });
  // if (existingMarketType) {
  //   return ApiResponse.error(res, "Market Type Name already exist", 400);
  // }

  //Creating Video
  let zones = await MarketType.create({
    name,
    marketZoneId,
  });
  console.log(" Zones ", zones, data);
  var id = zones?.id;
  const marketData = data.map((obj) => ({
    ...obj,
    ["marketTypeId"]: id,
  }));

  let datas = await MarketTypeData.bulkCreate(marketData);
  if (!zones || !data)
    return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, datas);
};
const updateMarket = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const [updatedRowsCount, updatedRows] = await Market.update(
    { name: name },
    { where: { id }, returning: true }
  );

  if (updatedRowsCount === 0) {
    return res.status(404).json({ error: "Market not found" });
  }
  return ApiResponse.success(res, "Updated Successfully");
};

const updateMarketZone = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const [updatedRowsCount, updatedRows] = await MarketZone.update(data, {
    where: { id },
    returning: true,
  });

  if (updatedRowsCount === 0) {
    return res.status(404).json({ error: "Market  Zone not found" });
  }
  return ApiResponse.success(res, "Updated Successfully");
};

const updateMarketType = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  console.log(id, " Body");
  const [updatedRowsCount, updatedRows] = await MarketType.update(data, {
    where: { id },
    returning: true,
  });

  if (updatedRowsCount === 0) {
    return res.status(404).json({ error: "Market  Type not found" });
  }
  return ApiResponse.success(res, "Updated Successfully");
};

const getMarket = async (req, res) => {
  const { id } = req.params;
  const market = await Market.findByPk(id);
  if (!market) {
    return res.status(404).json({ error: "Market not found" });
  }

  return ApiResponse.success(res, market);
};

const getMarketZone = async (req, res) => {
  const { id } = req.params;
  const market = await MarketZone.findByPk(id, {
    include: Market,
  });
  if (!market) {
    return res.status(404).json({ error: "Market Zone not found" });
  }

  return ApiResponse.success(res, market);
};
const getMarketType = async (req, res) => {
  const { id } = req.params;
  var market = await MarketType.findByPk(id, {
    include: [{ model: MarketZone, include: Market }],
  });
  if (!market) {
    return res.status(404).json({ error: "Market Type not found" });
  }

  const marketTypes = await MarketTypeData.findAll({
    where: {
      marketTypeId: id,
    },
    include: MarketType,
  });
  market.status = marketTypes;
  return ApiResponse.success(res, market);
};

const getAllMarket = async (req, res) => {
  const market = await Market.findAll({});
  if (!market) {
    return res.status(404).json({ error: "Market  not found" });
  }
  return ApiResponse.success(res, market);
};
const getAllMarketZone = async (req, res) => {
  const market = await MarketZone.findAll({
    include: Market,
  });
  if (!market) {
    return res.status(404).json({ error: "Market Zone not found" });
  }

  return ApiResponse.success(res, market);
};
const getAllMarketType = async (req, res) => {
  const market = await MarketType.findAll({
    include: [{ model: MarketZone, include: Market }],
    order: [["createdAt", "DESC"]],
  });
  // if (!market) {
  //     return res.status(404).json({ error: 'Market Type not found' });
  // }
  for (const mark of market) {
    await fetchMarketStatus(mark);
  }
  return ApiResponse.success(res, market);
};
const deleteMarket = async (req, res) => {
  const { id } = req.params;
  const updatedRows = await Market.destroy({ where: { id } });

  if (updatedRows === 0) {
    return res.status(404).json({ error: "Market not found" });
  }

  return ApiResponse.success(res, "Deleted Sucessfully");
};
const deleteMarketZone = async (req, res) => {
  const { id } = req.params;
  const updatedRows = await MarketZone.destroy({ where: { id } });

  if (updatedRows === 0) {
    return res.status(404).json({ error: "Market Zone not found" });
  }

  return ApiResponse.success(res, "Deleted Sucessfully");
};
const deleteMarketType = async (req, res) => {
  const { id } = req.params;
  const updatedRows = await MarketType.destroy({ where: { id } });

  if (updatedRows === 0) {
    return res.status(404).json({ error: "Market Type not found" });
  }
  const updatedRowss = await MarketTypeData.destroy({
    where: { marketTypeId: id },
  });

  return ApiResponse.success(res, "Deleted Sucessfully");
};

//
const findAllMarketZoneFromMarket = async (req, res) => {
  const { id } = req.params;
  const market = await MarketZone.findAll({
    where: { marketId: id },
    order: [["createdAt", "DESC"]],
  });
  if (!market) {
    return res
      .status(404)
      .json({ error: "No Market Zone with this Market ID not found" });
  }

  return ApiResponse.success(res, market);
};
const findAllMarketTypeFromMarketZone = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  const market = await MarketType.findAll({
    where: {
      marketZoneId: id,
      createdAt: {
        [Sequelize.Op.between]: [new Date(date), new Date(date + " 23:59:59")],
      },
    },
    include: [{ model: MarketZone, include: Market }],
    order: [["createdAt", "DESC"]],
  });

  if (!market) {
    return res
      .status(404)
      .json({ error: "No Market Type with this Market  Zone ID not found" });
  }
  for (const mark of market) {
    await fetchMarketStatus(mark);
  }

  return ApiResponse.success(res, market);
};
const findAllMarketTypeFromMarket = async (req, res) => {
  const { id } = req.params;
  const market = await MarketType.findAll({
    include: [
      {
        model: MarketZone,
        where: { marketId: id },
        include: [Market],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  if (!market) {
    return res
      .status(404)
      .json({ error: "No Market Type with this Market  ID not found" });
  }

  return ApiResponse.success(res, market);
};

const findAllMarketTypeFromBoth = async (req, res) => {
  const { zoneId, typeId } = req.params;
  console.log(" Zone Id and TypeID ", zoneId, typeId);
  const market = await MarketType.findAll({
    where: { marketZoneId: zoneId, id: typeId },
    // where: { marketZoneId: zoneId },

    include: [{ model: MarketZone, include: Market }],
    order: [["createdAt", "DESC"]],
  });

  if (!market) {
    return res
      .status(404)
      .json({ error: "No Market Type with this Market  Zone ID not found" });
  }

  return ApiResponse.success(res, market);
};

// const findAllMarketTypeFromBothById = async (req, res) => {
//   const { zoneId, typeId } = req.params;
//   console.log(" Zone Id and TypeID ", zoneId, typeId);
//   const market = await MarketType.findAll({
//     where: { marketZoneId: zoneId },
//     // where: { marketZoneId: zoneId },

//     include: [
//       {
//         model: MarketTypeData,
//         where: { marketTypeId: typeId },
//       },
//     ],
//     order: [["createdAt", "DESC"]],
//   });

//   if (!market) {
//     return res
//       .status(404)
//       .json({ error: "No Market Type with this Market  Zone ID not found" });
//   }

//   return ApiResponse.success(res, market);
// };

const findAllMarketTypeFromBothById = async (req, res) => {
  const { zoneId, typeId } = req.params;

  try {
    const marketTypes = await MarketTypeData.findAll({
      where: {
        ...(typeId !== 0 && { marketTypeId: typeId }),
      },
      include: {
        model: MarketType,
        required: true,
        where: { marketZoneId: zoneId },
      },
    });
    return ApiResponse.success(res, marketTypes);
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Seeds the Market table with 'fish' and 'shrimp' if they don't already exist.
 */
async function seedMarkets() {
  try {
    const marketNames = ["fish", "shrimp"];

    for (const name of marketNames) {
      // Use findOrCreate to avoid duplicates
      const [market, created] = await Market.findOrCreate({
        where: { name },
        defaults: {
          status: "1", // defaults to '1' anyway, but explicit
        },
      });

      if (created) {
        console.log(`✅ Market "${name}" created (ID: ${market.id})`);
      } else {
        console.log(`⏩ Market "${name}" already exists (ID: ${market.id})`);
      }
    }

    console.log("✅ Market seeding completed.");
  } catch (error) {
    console.error("❌ Failed to seed markets:", error);
    throw error; // re-throw so the app can handle it
  }
}

module.exports = {
  findAllMarketTypeFromBothById,
  getAllZones,
  createMarket,
  createMarketZone,
  createMarketType,
  updateMarket,
  updateMarketZone,
  updateMarketType,
  getMarket,
  getMarketZone,
  getMarketType,
  getAllMarket,
  getAllMarketZone,
  getAllMarketType,
  deleteMarket,seedMarkets,
  deleteMarketZone,
  deleteMarketType,
  findAllMarketZoneFromMarket,
  findAllMarketTypeFromMarketZone,
  findAllMarketTypeFromMarket,
  findAllMarketTypeFromBoth,
};
