const Joi = require("joi")
const AbsenceLeaveModule = require("../../model/Forms/AbsenceLeaveModule");
const newEmployee = require("../../model/Forms/newEmployee");



const AbsenceLeaveController ={
    
    async AbsenceLeave(req,res,next){
        const AbsenceLeaveSchema = Joi.object({
            employeeId: Joi.objectId().required(), // ObjectId format
            date:Joi.date().required(),
            leaveType:Joi.string().required(),
            leaveStartDate:Joi.date().allow(null,''),
            leaveEndDate:Joi.date().allow(null,''),
            totalSickLeaveDays:Joi.number.allow(null,""),
            totalAbsenceLeaveDays:Joi.number.allow(null,""),
            comment:Joi.string.allow(null,'')
        })
      
        const error = AbsenceLeaveSchema.validate(req.body);

        if(error){
            return next(error)
        }

        const {employeeId,date,leaveType,leaveStartDate,leaveEndDate,totalSickLeaveDays,totalAbsenceLeaveDays,comment} = req.body

        try {
            const employee = await newEmployee.findById(employeeId).select("name");
            if(!employee){
                return res.status(404).json({message:"Employee not found"})
            }
            let AbsenceLeave = await AbsenceLeaveModule.create({
                employeeId,
                data,
                leaveType,
                leaveStartDate,
                leaveEndDate,
                totalSickLeaveDays,
                totalAbsenceLeaveDays,
                comment
            });
            res.status(201).json({
                message:`Leave successfully added for ${employee.name}`,
                AbsenceLeave
            })
        } catch (error) {
            return next(error)
            
        }
        
    },
    
}