const mongoose = require("mongoose");
const moment = require("moment");

// Connect to MongoDB
// mongoose
//   .connect("mongodb://localhost:27017/tasksdb", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Failed to connect to MongoDB", err));

// // Define the task schema and model
// const taskSchema = new mongoose.Schema({
//   name: String,
//   completedAt: Date,
// });

// const Task = mongoose.model("Task", taskSchema);

// Utility functions to filter tasks based on date

// Filter tasks completed today
async function getTodayTasks() {
  const startOfDay = moment().startOf("day");
  const endOfDay = moment().endOf("day");

  return await Task.find({
    completedAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
  });
}

// Filter tasks completed yesterday
async function getYesterdayTasks() {
  const startOfYesterday = moment().subtract(1, "days").startOf("day");
  const endOfYesterday = moment().subtract(1, "days").endOf("day");

  return await Task.find({
    completedAt: {
      $gte: startOfYesterday.toDate(),
      $lte: endOfYesterday.toDate(),
    },
  });
}

// Filter tasks completed this week
async function getThisWeekTasks() {
  const startOfWeek = moment().startOf("week");
  const endOfWeek = moment().endOf("week");

  return await Task.find({
    completedAt: { $gte: startOfWeek.toDate(), $lte: endOfWeek.toDate() },
  });
}

// Filter tasks completed this month
async function getThisMonthTasks() {
  const startOfMonth = moment().startOf("month");
  const endOfMonth = moment().endOf("month");

  return await Task.find({
    completedAt: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() },
  });
}

// Filter tasks within a custom date range
async function getTasksByDateRange(startDate, endDate) {
  return await Task.find({
    completedAt: {
      $gte: moment(startDate).startOf("day").toDate(),
      $lte: moment(endDate).endOf("day").toDate(),
    },
  });
}

// Example usage
async function displayFilteredTasks() {
  try {
    const todayTasks = await getTodayTasks();
    const yesterdayTasks = await getYesterdayTasks();
    const thisWeekTasks = await getThisWeekTasks();
    const thisMonthTasks = await getThisMonthTasks();
    const customRangeTasks = await getTasksByDateRange(
      "2024-10-01",
      "2024-10-31"
    );

    console.log("Tasks completed today:", todayTasks);
    console.log("Tasks completed yesterday:", yesterdayTasks);
    console.log("Tasks completed this week:", thisWeekTasks);
    console.log("Tasks completed this month:", thisMonthTasks);
    console.log(
      "Tasks completed in custom date range (October 2024):",
      customRangeTasks
    );
  } catch (err) {
    console.error("Error retrieving tasks:", err);
  } finally {
    mongoose.connection.close();
  }
}

displayFilteredTasks();
