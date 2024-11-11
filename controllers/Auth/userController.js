
const User = require("../../model/authmodle/user");

const userController ={
 

    async me (req,res,next){
        let user;

        try{
      user =  await User.find({_id: req.user._id})
 if(!user){
    return next(Error('User Not Found.'))
 }

        }catch(err){
            return next(err)
        }
   return res.json(user)
    }



}

module.exports = userController;
