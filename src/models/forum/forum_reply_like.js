const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const User = require("../user");
const ForumReply = require("./forum_reply");

const ForumReplyLike = sequelize.define(
  "forum_reply_like",
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
  },
  { freezeTableName: true }
);
ForumReply.hasMany(ForumReplyLike);
ForumReplyLike.belongsTo(ForumReply);

User.hasMany(ForumReplyLike);
ForumReplyLike.belongsTo(User);

module.exports = ForumReplyLike;
