const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { models } = require("../models/init-models");
const { Op } = require("sequelize");

const signIn = async (req, res) => {
  try {
    
    //Op.or is Nested Logical Operator to Compare Multiple Situation
    const checkUsername = await models.users.findOne({
      where: {
        [Op.or]: [
          { username: req.body.usernameOrEmail },
          { user_email: req.body.usernameOrEmail },
        ],
      },
    });
    if (!checkUsername) {
      res.status(404).json({
        message: "Username or Email doesnt Exist",
      });
    } else {
      const dataPassword = checkUsername.dataValues;
      if (bcrypt.compareSync(req.body.password, dataPassword.user_password)) {
        delete dataPassword.user_password;
        const token = jwt.sign(dataPassword, process.env.ACCESS_TOKEN, {
          expiresIn: "24h",
        });
        res.status(200).json({
          message: "You're Login",
          token: token,
        });
      } else {
        res.status(403).json({
          message: "Wrong Password",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({
      message: "You're Not Authorized",
    });
  } else {
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN);
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
  }
};

module.exports = { signIn, verifyToken };
