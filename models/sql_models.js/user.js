var User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING,
    required: true
  },
  lastName: {
    type: Sequelize.STRING,
    required: true
  },
  fullName: {
    type: Sequelize.STRING,
    required: true
  },
  username: {
    type: Sequelize.STRING,
    required: true,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    required: true
  },
  email: {
    type: Sequelize.STRING,
    required: true,
    match: /\S+@\S+\.\S+/
  },
  following: [],
  followedBy: [],
  profilePicture: {
    type: Sequelize.STRING,
  }
}, {
  freezeTableName: true
});

module.exports = User;
