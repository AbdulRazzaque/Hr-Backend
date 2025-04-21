const Joi = require("joi");
const User = require("../../model/authmodle/user");
const bcrypt = require("bcryptjs");
const JWT = require("../../services/Jwt");


const LoginSchema = {
  async login(req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string(),
    });

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    //--------------chack user-------------
    let AccessToken;
    let loginUser
    try {
       loginUser = await User.findOne({ email: req.body.email });

      if (!loginUser) {
        return next(Error('Invalid username or password'));
      }
    } catch (error) {
      return next(error);
    }
    //-------------match password---------------------
    // console.log(loginUser)

    const match =  bcrypt.compare(req.body.password, loginUser.password);

    if (!match) {
      return next(Error("User and Password are Wrong"));
    }

    AccessToken = JWT.sign({ _id: loginUser._id });
    res.json({ AccessToken });
  },
};
module.exports = LoginSchema;

