const express = require("express");
const MarketServices = require("../services/market_services");
const router = express.Router();

const errorHandler = require("../configs/error_handler_config");
const verifyToken = require("../middlewares/verify_token");

router.get("/all", errorHandler(MarketServices.getAllMarket));
router.get("/", verifyToken, errorHandler(MarketServices.getAllZones));
//MARTKET
router.post("/", errorHandler(MarketServices.createMarket));
router.put("/:id", errorHandler(MarketServices.updateMarket));
router.get("/:id", errorHandler(MarketServices.getMarket));
router.delete("/:id", errorHandler(MarketServices.deleteMarket));

//MARKET ZONE
router.get("/zone/all", errorHandler(MarketServices.getAllMarketZone));
router.post("/zone/", errorHandler(MarketServices.createMarketZone));
router.put("/zone/:id", errorHandler(MarketServices.updateMarketZone));
router.get("/zone/:id", errorHandler(MarketServices.getMarketZone));
router.delete("/zone/:id", errorHandler(MarketServices.deleteMarketZone));

//Market Type
router.get("/type/all", errorHandler(MarketServices.getAllMarketType));
router.post("/type/", errorHandler(MarketServices.createMarketType));
router.put("/type/:id", errorHandler(MarketServices.updateMarketType));
router.get("/type/:id", errorHandler(MarketServices.getMarketType));
router.delete("/type/:id", errorHandler(MarketServices.deleteMarketType));
// FIND ALL MARKET ZONE OF SPECIFIC MARKET
router.get(
  "/find/market/:id",
  errorHandler(MarketServices.findAllMarketZoneFromMarket)
);
router.get(
  "/find/zone/:id",
  errorHandler(MarketServices.findAllMarketTypeFromMarketZone)
);
router.get(
  "/find/type/:id",
  errorHandler(MarketServices.findAllMarketTypeFromMarket)
);
// router.get(
//   "/find/filter/:typeId/:zoneId",
//   errorHandler(MarketServices.findAllMarketTypeFromBoth)
// );
router.get(
  "/find/filter/:typeId/:zoneId",
  errorHandler(MarketServices.findAllMarketTypeFromBothById)
);

module.exports = router;
