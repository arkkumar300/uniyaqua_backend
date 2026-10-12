const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const ForumTopic = require("./forum_topic");
const User = require("../user");

const Forum = sequelize.define(
  "forum",
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl1: {
      type: DataTypes.TEXT,
    },
    imageUrl2: {
      type: DataTypes.STRING,
    },
    imageUrl3: {
      type: DataTypes.STRING,
    },
    imageUrl4: {
      type: DataTypes.STRING,
    },
    imageUrl5: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["1", "2"],
      defaultValue: "1",
    },
  },
  { freezeTableName: true }
);
ForumTopic.hasMany(Forum);
Forum.belongsTo(ForumTopic);

User.hasMany(Forum);
Forum.belongsTo(User);

module.exports = Forum;
