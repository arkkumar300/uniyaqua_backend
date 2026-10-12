const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db_config");
const User = require("./user");
const Topic = require("./topic");
const News = sequelize.define(
  "news",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ["1", "2"],
      defaultValue: "1",
    },
  },
  { freezeTableName: true }
);

User.hasMany(News);
News.belongsTo(User);
// TOPIC

// User.hasOne(Topic);

module.exports = News;
