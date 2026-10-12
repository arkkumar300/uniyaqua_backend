const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/db_config");
const Forum = require("./forum");
const User = require("../user");

const ForumBookmark = sequelize.define(
  "forum_bookmark",
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
Forum.hasMany(ForumBookmark);
ForumBookmark.belongsTo(Forum);

User.hasMany(ForumBookmark);
ForumBookmark.belongsTo(User);

module.exports = ForumBookmark;
