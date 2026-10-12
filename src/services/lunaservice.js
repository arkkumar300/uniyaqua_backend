// const { where } = require("sequelize");
// const LunarEvent = require("../models/lunarevent");

// // Get all lunar events
// const getLunarEvents = async (req, res) => {
//   try {
//     const events = await LunarEvent.findAll({
//       order: [["createdAt", "DESC"]],
//     });
//     res.status(200).json(events);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get the next upcoming lunar event
// const getNextLunarEvent = async (req, res) => {
//   try {
//     const currentDate = new Date();
//     const nextEvent = await LunarEvent.findOne({
//       date: { $gte: currentDate },
//     }).sort({ date: 1 });
//     if (nextEvent) {
//       res.status(200).json(nextEvent);
//     } else {
//       res.status(404).json({ message: "No upcoming events found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Create a new lunar event
// const createLunarEvent = async (req, res) => {
//   console.log("these is  creating the events");
//   try {
//     const { name, date } = req.body;
//     const newEvent = new LunarEvent({ name, date });
//     await newEvent.save();
//     res.status(201).json(newEvent);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Update an existing lunar event
// const updateLunarEvent = async (req, res) => {
//   console.log("these is  updating the events");
//   console.log(req.body);
//   const { id } = req.params;
//   const { title, datetime } = req.body;
//   let eventList = await LunarEvent.update(
//     { name: title, date: datetime },
//     {
//       where: { id: id },
//     }
//   );

//   if (!eventList) return ApiResponse.error(res, "Something Went Wrong", 200);

//   return ApiResponse.success(res, eventList);
// };

// // Delete a lunar event
// const deleteLunarEvent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedEvent = await LunarEvent.findByIdAndDelete(id);
//     if (deletedEvent) {
//       res.status(200).json({ message: "Event deleted successfully" });
//     } else {
//       res.status(404).json({ message: "Event not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   getLunarEvents,
//   getNextLunarEvent,
//   createLunarEvent,
//   updateLunarEvent,
//   deleteLunarEvent,
// };
const { where } = require("sequelize");
const LunarEvent = require("../models/lunarevent");
const ApiResponse = require("../configs/api_response");

// Get all lunar events
const getLunarEvents = async (req, res) => {
  try {
    const events = await LunarEvent.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the next upcoming lunar event
const getNextLunarEvent = async (req, res) => {
  try {
    const currentDate = new Date();
    const nextEvent = await LunarEvent.findOne({
      where: { date: { [where.gte]: currentDate } },
      order: [["date", "ASC"]],
    });

    if (nextEvent) {
      return ApiResponse.success(res, nextEvent);
    }
    return ApiResponse.error(res, "No upcoming events found", 404);
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};

// Create a new lunar event
const createLunarEvent = async (req, res) => {
  try {
    const body = req.body;

    const newEvent = await LunarEvent.create({
      name: body.name,
      date: body.date,
    });

    return ApiResponse.success(res, newEvent, 201);
  } catch (error) {
    console.log(error);
    return ApiResponse.error(res, error.message, 400);
  }
};

// Update an existing lunar event
const updateLunarEvent = async (req, res) => {
  console.log("Updating an existing lunar event...");
  const id = req.params.Id;
  console.log(id);
  const body = req.body;

  try {
    const updateCount = await LunarEvent.update(body, {
      where: { id },
    });

    if (!updateCount) {
      return ApiResponse.error(res, "Event not found or no changes made", 404);
    }

    const updatedEvent = await LunarEvent.findByPk(id);
    return ApiResponse.success(res, updatedEvent);
  } catch (error) {
    console.log(error);
    return ApiResponse.error(res, error.message, 500);
  }
};

// Delete a lunar event
const deleteLunarEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await LunarEvent.destroy({ where: { id } });

    if (!deletedEvent) {
      return ApiResponse.error(res, "Event not found", 404);
    }

    return ApiResponse.success(res, { message: "Event deleted successfully" });
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};

module.exports = {
  getLunarEvents,
  getNextLunarEvent,
  createLunarEvent,
  updateLunarEvent,
  deleteLunarEvent,
};
