const Joi = require("joi");
const departmentModule = require("../../model/Forms/departmentModule");


const departmentController ={

    async  addDepartment (req,res,next){
        const departmentSchema = Joi.object({
            department:Joi.string().required()
        });

        const {error} = departmentSchema.validate(req.body);

        if(error){
            return next(error)
        }

        const {department} = req.body;

        try {
            let addDepartment = await departmentModule.create({
                department
            });
            res.status(201).json({
                message:`successfully created`,
                addDepartment
            })
        } catch (error) {
            return next(error)
        }
    },

    async deleteDepartment (req,res,next){
        try {
            let deleteDepartment = await departmentModule.findByIdAndRemove({
                _id:req.params.id
            })
            if(!deleteDepartment){
                return next(Error("Nothing to delete"))
            }
            res.json({message:"Delete successfully",deleteDepartment})
        } catch (error) {
            return next(error)
            
        }
    },

    async allDepartment(req,res,next) {
        try{
            
            let allDepartment = await departmentModule.find({})
            .sort({_id:-1})

            res.status(200).json({message:"All department list",allDepartment})
        }
        catch(error){
            return next(error)
        }
    }
}

module.exports = departmentController