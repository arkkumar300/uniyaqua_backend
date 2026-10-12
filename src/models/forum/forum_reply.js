const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const User = require("../user");
const ForumAnswer = require("./forum_answer");

const ForumReply = sequelize.define(
  "forum_reply",
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
  },
  { freezeTableName: true }
);
ForumAnswer.hasMany(ForumReply);
ForumReply.belongsTo(ForumAnswer);

User.hasMany(ForumReply);
ForumReply.belongsTo(User);

module.exports = ForumReply;
