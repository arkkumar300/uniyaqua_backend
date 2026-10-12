const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const Forum = require("./forum");
const User = require("../user");

const ForumLike = sequelize.define(
  "forum_like",
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
Forum.hasMany(ForumLike);
ForumLike.belongsTo(Forum);

User.hasMany(ForumLike);
ForumLike.belongsTo(User);

module.exports = ForumLike;
