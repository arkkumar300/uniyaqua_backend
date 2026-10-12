const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const Forum = require("./forum");
const User = require("../user");

const ForumAnswer = sequelize.define(
  "forum_answer",
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
    content: {
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
  },
  { freezeTableName: true }
);
Forum.hasMany(ForumAnswer);
ForumAnswer.belongsTo(Forum);

User.hasMany(ForumAnswer);
ForumAnswer.belongsTo(User);

module.exports = ForumAnswer;
