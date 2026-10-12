const AllTest = require("./models/sample/test");
const { Sequelize } = require('sequelize');

function deleteTestsSync() {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return AllTest.destroy({
    where: {
      status: "1",
      createdAt: {
        [Sequelize.Op.lt]: today, 
      },
    },
  })
    .then((deletedCount) => {
      return deletedCount;
    })
    .catch((error) => {
      console.error('Error deleting tests:', error);
      throw error;
    });
}

module.exports = { deleteTestsSync };
