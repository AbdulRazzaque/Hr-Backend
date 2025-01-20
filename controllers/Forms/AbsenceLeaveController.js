const Joi = require("joi")
const AbsenceLeaveModule = require("../../model/Forms/AbsenceLeaveModule");
const newEmployee = require("../../model/Forms/newEmployee");



const AbsenceLeaveController ={
    
    async AbsenceLeave(req, res, next) {
        const AbsenceLeaveSchema = Joi.object({
            employeeId: Joi.objectId().required(), // ObjectId format
            date:Joi.date().required(),
            leaveType:Joi.string().required(),
            leaveStartDate:Joi.date().allow(null,''),
            leaveEndDate:Joi.date().allow(null,''),
            totalSickLeaveDays:Joi.number().allow(null,''),
            totalAbsenceLeaveDays:Joi.number().allow(null,''),
            comment:Joi.string().allow(null,'')
        });
    
        const { error } = AbsenceLeaveSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
    
        const {
            employeeId,
            date,
            leaveType,
            leaveStartDate,
            leaveEndDate,
            totalSickLeaveDays,
            totalAbsenceLeaveDays,
            comment
        } = req.body;
    
        try {
            const employee = await newEmployee.findById(employeeId).select("name");
            if (!employee) {
                return res.status(404).json({ message: "Employee not found" });
            }
    
            const AbsenceLeave = await AbsenceLeaveModule.create({
                employeeId,
                date,
                leaveType,
                leaveStartDate,
                leaveEndDate,
                totalSickLeaveDays,
                totalAbsenceLeaveDays,
                comment
            });
    
            res.status(201).json({
                message: `Leave successfully added for ${employee.name}`,
                AbsenceLeave
            });
        } catch (error) {
            next(error); // Pass the error to the middleware
        }
    },
    
    async updateAbsenceLeave (req,res,next){
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
            let updateAbsence = await AbsenceLeaveModule.findOneAndUpdate(
                {id:req.params.id},
                {employeeId,date,leaveType,leaveStartDate,leaveEndDate,totalSickLeaveDays,totalAbsenceLeaveDays,comment},
                {new:true}
            );
            res.status(201).json({message:"update successfully",updateAbsence})
        } catch (error) {
            return next (error)
            
        }
    },
    async deleteAbsence (req,res,next){
        try {
            let deleteAbsence = await AbsenceLeaveModule.findOneAndRemove({
                _id:req.params.id,
            });
            if(!deleteAbsence){
                return  next(Error("NOting to delete."))
            }
            res.json({message:"Delete successfully",deleteAbsence})
        } catch (error) {
            return next (error)
            
        }
    },
 
 
    async AllAbsenceLeave(req,res,next){

        try {
            let allAbsence = await AbsenceLeaveModule.find({})
            res.json({allAbsence})
        } catch (error) {
            return next(error)
            
        }
    },
    async getEmployeeAbsenceLeave (req,res,next){

        const employeeId = req.params.id;
        try {
            
            const getEmployeeAbsence = await AbsenceLeaveModule.find({employeeId})
            .populate("employeeId")
            .sort({_id:-1})
            if(!getEmployeeAbsence || getEmployeeAbsence.length ===0){
                return res.json({message:"NO Absence leave found"})
            }
            res.status(200).json({ 
                message: `Absence leave for employee ID: ${employeeId}`, 
                getEmployeeAbsence 
              });
        } catch (error) {
            return next (error)
        }
    },
    async getTotalSickLeave(req, res, next) {
        const employeeId  = req.params.id;  // Access employeeId from the request body
        const currentYear = new Date().getFullYear();
        try {
            // Assuming AbsenceLeaveModule is a Mongoose model or array, filter based on employeeId
            const employeeLeaves = await AbsenceLeaveModule.find({ 
                employeeId,
                startDate: {
                    $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                    $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
                },
             }).sort({createdAt:-1});

            if(!employeeLeaves || employeeLeaves.length ===0){
                return res.status(404).json({ message: "No leave records found for this employee." })
            }
            // Calculate total sick and absence leave days
            let totalSickLeave = 0;
            let totalAbsenceLeave = 0;

            
    
            employeeLeaves.forEach(record => {
                if (record.leaveType.toLowerCase() === 'sick') {
                    totalSickLeave += record.totalSickLeaveDays || 0;
                }
                if (record.leaveType.toLowerCase() === 'absent') {
                    totalAbsenceLeave += record.totalAbsenceLeaveDays || 0;
                }
            });
    
            // Send the response with the totals
            res.json({
                employeeId,
                totalSickLeave,
                totalAbsenceLeave,
                allLeaveRecords:employeeLeaves
            });
    
        } catch (error) {
            return next(error);
        }
    }
    
        
        
        
    
    
};

module.exports = AbsenceLeaveController