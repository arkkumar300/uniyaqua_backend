const express = require("express");
const cron = require("node-cron");
const sequelize = require("./src/configs/db_config");
const routes = require("./src/controllers/index");
const handleError = require("./src/middlewares/handle_error");
const { deleteTestsSync } = require("./src/cronJobs");
const fileUpload = require("express-fileupload");
const cors = require("cors");
require("./src/models/user");
require("./src/models/market/market");

const { seedMarkets } = require("./src/services/market_services"); // <-- ADD THIS

const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(fileUpload());
// app.use(express.json());
app.use(routes);
app.use(handleError);

const port = process.env.PORT || 3001;

cron.schedule(
  "0 0 * * *",
  () => {
    deleteTestsSync()
      .then((deletedCount) => {
        console.log(
          `${deletedCount} Tests deleted successfully on  ${new Date()}`
        );
      })
      .catch((error) => {
        console.error("Failed to delete tests:", error);
      });
  },
  {
    timezone: "Asia/Kolkata",
  }
);

sequelize.authenticate()
  .then(async () => {
    console.log("Db connected");
    await sequelize.sync({ alter: true });

    console.log("Tables synced");
    await seedMarkets();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(console.error);