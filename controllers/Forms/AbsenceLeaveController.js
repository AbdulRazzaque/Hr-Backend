const Joi = require("joi")
const AbsenceLeaveModule = require("../../model/Forms/AbsenceLeaveModule");
const newEmployee = require("../../model/Forms/newEmployee");
const EmployeeResumeModel = require("../../model/Forms/EmployeeResume");


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
        // console.log(req.body)
        const AbsenceLeaveSchema = Joi.object({
            employeeId: Joi.objectId().required(), // ObjectId format
            date:Joi.date().required(),
            leaveType:Joi.string().required(),
            leaveStartDate:Joi.date().allow(null,''),
            leaveEndDate:Joi.date().allow(null,''),
       
            totalSickLeaveDays:Joi.number().allow(null,''),
            totalAbsenceLeaveDays:Joi.number().allow(null,''),
            comment:Joi.string().allow(null,'')
        })
      
        const { error } = AbsenceLeaveSchema.validate(req.body); // ✅ Fix: Destructure `error`

        if(error){
            return res.status(400).json({ message: error.details[0].message }); // ✅ Return proper error response
        }

        const {employeeId,date,leaveType,leaveStartDate,leaveEndDate,totalSickLeaveDays,totalAbsenceLeaveDays,comment} = req.body

        try {
          const updateAbsence = await AbsenceLeaveModule.findOneAndUpdate(
                {_id:req.params.id},
                {employeeId,date,leaveType,leaveStartDate,leaveEndDate,totalSickLeaveDays,totalAbsenceLeaveDays,comment},
                {new:true}
            );
            
            if(!updateAbsence){
                return res.json({ message: "Leave record not found" }); // ✅ Handle missing record
            }
            res.status(201).json({message:"update successfully",updateAbsence})
        } catch (error) {
            console.log(error)
            return next(error);
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
    // async getTotalSickLeave(req, res, next) {
    //     const employeeId  = req.params.id;  // Access employeeId from the request body
    //     const currentYear = new Date().getFullYear();
    //     try {
    //         // Assuming AbsenceLeaveModule is a Mongoose model or array, filter based on employeeId
    //         const employeeLeaves = await AbsenceLeaveModule.find({ 
    //             employeeId,
    //             startDate: {
    //                 $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
    //                 $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
    //             },
    //          })
    //          .populate('employeeId')
    //          .sort({createdAt:-1});

    //         if(!employeeLeaves || employeeLeaves.length ===0){
    //             return res.status(404).json({ message: "No leave records found for this employee." })
    //         }
    //         // Calculate total sick and absence leave days
    //         let totalSickLeave = 0;
    //         let totalAbsenceLeave = 0;

            
    
    //         employeeLeaves.forEach(record => {
    //             if (record.leaveType.toLowerCase() === 'sick') {
    //                 totalSickLeave += record.totalSickLeaveDays || 0;
    //             }
    //             if (record.leaveType.toLowerCase() === 'absent') {
    //                 totalAbsenceLeave += record.totalAbsenceLeaveDays || 0;
    //             }
    //         });
    
    //         // Send the response with the totals
    //         res.json({
    //             employeeId,
    //             totalSickLeave,
    //             totalAbsenceLeave,
    //             allLeaveRecords:employeeLeaves
    //         });
    
    //     } catch (error) {
    //         return next(error);
    //     }
    // } 


    async getTotalSickLeave(req, res, next) {
        const employeeId = req.params.id;
        try {
            // Fetch resume history data
            const employeeResume = await EmployeeResumeModel.find({ employeeId })
                .sort({ resumeOfWorkDate: 1 })  // Oldest to newest sorting
                .lean();
    
            // Debugging to check data before sorting
            console.log("Employee Resume Data:", employeeResume);
    
            if (!Array.isArray(employeeResume) || employeeResume.length === 0) {
                return res.status(404).json({ message: "No resume history found for this employee." });
            }
    
            // Find the first resumeOfWorkDate for the employee
            const firstResumeOfYear = employeeResume.find(resume => {
                return new Date(resume.resumeOfWorkDate).getFullYear() === new Date().getFullYear();
            });
    
            if (!firstResumeOfYear) {
                return res.status(404).json({ message: "No valid resume date found for this employee in this year." });
            }
    
            const startDate = new Date(firstResumeOfYear.resumeOfWorkDate);
            const endDate = new Date(startDate);
            endDate.setFullYear(endDate.getFullYear() + 1);  // 1-year range
    
            // Check if the current date is more than a year from resumeOfWorkDate
            const currentDate = new Date();
            let totalSickLeave = 0;
            let totalAbsenceLeave = 0;
    
            // Reset the count after each year is completed
            if (currentDate >= endDate) {
                // Reset leave counts as 1 year is complete
                totalSickLeave = 0;
                totalAbsenceLeave = 0;
                
                // Update the startDate to the next year's anniversary
                startDate.setFullYear(startDate.getFullYear() + 1);
                endDate.setFullYear(endDate.getFullYear() + 1);  // Update the end date to the next year
            }
    
            // Fetch employee leaves within the date range (current year or next year after reset)
            const employeeLeaves = await AbsenceLeaveModule.find({
                employeeId,
                startDate: {
                    $gte: startDate,
                    $lt: endDate,
                },
            })
            .populate('employeeId')
            .sort({ createdAt: -1 });
    
            if (!employeeLeaves.length) {
                return res.status(200).json({
                    employeeId,
                    totalSickLeave: 0,
                    totalAbsenceLeave: 0,
                    resumeStartDate: startDate,
                    allLeaveRecords: [],
                });
            }
    
            // Calculate total sick & absence leave days
            employeeLeaves.forEach(record => {
                if (record.leaveType.toLowerCase() === 'sick') {
                    totalSickLeave += record.totalSickLeaveDays || 0;
                }
                if (record.leaveType.toLowerCase() === 'absent') {
                    totalAbsenceLeave += record.totalAbsenceLeaveDays || 0;
                }
            });
    
            res.json({
                employeeId,
                totalSickLeave,
                totalAbsenceLeave,
                resumeStartDate: startDate,
                allLeaveRecords: employeeLeaves
            });
        } catch (error) {
            console.error("Error in getTotalSickLeave:", error);
            return next(error);
        }
    }
    
    
    
};

module.exports = AbsenceLeaveController