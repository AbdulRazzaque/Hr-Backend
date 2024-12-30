const Joi = require("joi")
const warningModule = require("../../model/Forms/warningModule");
const newEmployee = require("../../model/Forms/newEmployee");


const WarningFormController ={
    async addWarning (req,res,next){
        const WarningFormSchema = Joi.object({
            employeeId: Joi.objectId().required(),
            date:Joi.date().required(),
            warningType:Joi.string().required(),
            penaltyAmount:Joi.string().allow(null,""),
            subject:Joi.string().allow().allow(null,"")

        });

        const {error} = WarningFormSchema.validate(req.body)
        
        if(error){
            return next(error)
        }
        
        const {
            employeeId,
            date,
            warningType,
            penaltyAmount,
            subject
        } = req.body;
        const employee = await newEmployee.findById(employeeId);
        if(!employee){
            return  res.status(404).json({message:"Employee not Found"});
        }
 
        try{
            let addWarning = await warningModule.create({
                employeeId,
                date,
                warningType,
                penaltyAmount,
                subject
            });
            res.status(201).json({
                message:`Warning successfully created for ${employee.name}`,
                addWarning:addWarning
            });
        }catch(error){ 
            return next(error)
        }
    },

    async updateWarning(req,res,next){

        const WarningFormSchema = Joi.object({
            employeeId: Joi.objectId().required(),
            date:Joi.date().required(),
            warningType:Joi.string().required(),
            penaltyAmount:Joi.string().allow(null,""),
            subject:Joi.string().allow().allow(null,"")

        });

        const {error} = WarningFormSchema.validate(req.body)
        
        if(error){
            return next(error)
        }
        
        const {
            employeeId,
            date,
            warningType,
            penaltyAmount,
            subject
        } = req.body;

        try {
            let updateWarning = await warningModule.findByIdAndUpdate(
                {_id:req.params.id},
             
                {
                    employeeId,
                    date,
                    warningType,
                    penaltyAmount,
                    subject
                },
                {new : true}

            );
            res.status(201).json({message:"Update successfully",updateWarning})
        } catch (error) {
            return next(error)
            
        }
    },

   async deleteWarning(req,res,next){
        try {
            let deleteWarning = await warningModule.findByIdAndRemove({
                _id:req.params.id,
            })
            if(!deleteWarning){
                return next(Error("Nothing to delete"))
            }
            res.json({message:"Delete successfully",deleteWarning})
        } catch (error) {
            return next(error)
        }
    },
    async allWarning(req,res,next){
        try {
            let allWarning = await warningModule.find({})
            .sort({_id:-1})
 
            res.status(200).json({message:"All warning list",allWarning})
        } 
        catch (error) {
           return next(error)             
        }
    },

    async getEmployeeByIdWarning(req,res,next){
        const employeeId = req.params.id;
        try { 
            const getWarning = await warningModule.find({employeeId})
            .populate("employeeId")
            .sort({_id:-1})
            if(!getWarning || getWarning.length ===0){
                return res.json({message:"NO Waring this employee"})
            } 
            res.status(200).json({
                message:`Warning for employee ID: ${employeeId}`,
                getWarning
            })
        } catch (error) {
            return next (error)
            
        }
    }

}


module.exports = WarningFormController