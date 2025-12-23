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
            AbsenceLeaveStartDate:Joi.date().allow(null,''),
            AbsenceLeaveEndDate:Joi.date().allow(null,''),
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
            AbsenceLeaveStartDate,
            AbsenceLeaveEndDate,
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
                AbsenceLeaveStartDate,
                AbsenceLeaveEndDate,
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
            AbsenceLeaveStartDate:Joi.date().allow(null,''),
            AbsenceLeaveEndDate:Joi.date().allow(null,''),
            totalAbsenceLeaveDays:Joi.number().allow(null,''),
           
            comment:Joi.string().allow(null,'')
        })
      
        const { error } = AbsenceLeaveSchema.validate(req.body); // ✅ Fix: Destructure `error`

        if(error){
            return res.status(400).json({ message: error.details[0].message }); // ✅ Return proper error response
        }

        const {
            employeeId,
            date,
            leaveType,
            leaveStartDate,
            leaveEndDate,
            totalSickLeaveDays,
            totalAbsenceLeaveDays,
            AbsenceLeaveStartDate,
            AbsenceLeaveEndDate,
            comment
        } = req.body

        try {
          const updateAbsence = await AbsenceLeaveModule.findOneAndUpdate(
                {_id:req.params.id},
                {
                    employeeId,
                date,
                leaveType,
                leaveStartDate,
                leaveEndDate,
                totalSickLeaveDays,
                AbsenceLeaveStartDate,
                AbsenceLeaveEndDate,
                totalAbsenceLeaveDays,
                comment
                },
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
    //     const employeeId = req.params.id;
    //     try {
    //         // Fetch employee resume history (latest first)
    //         const employeeResume = await EmployeeResumeModel.find({ employeeId })
    //             .sort({ resumeOfWorkDate: -1 }) // Newest to oldest sorting
    //             .lean();
    
    //         console.log("Employee Resume Data:", employeeResume);
    
    //         let startDate;
    
    //         if (employeeResume.length > 0) {
    //             // Take the latest resumeOfWorkDate
    //             startDate = new Date(employeeResume[0].resumeOfWorkDate);
    //         } else {
    //             // If no resume exists, fetch employee joining date
    //             const employee = await newEmployee.findById(employeeId).lean();
    //             if (employee?.dateOfJoining) {
    //                 startDate = new Date(employee.dateOfJoining);
    //             } else {
    //                 return res.status(404).json({ message: "No resume history or joining date found for this employee." });
    //             }
    //         }
    
    //         const endDate = new Date(startDate);
    //         endDate.setFullYear(endDate.getFullYear() + 1); // 1-year range
    
    //         const currentDate = new Date();
    //         let totalSickLeave = 0;
    //         let totalAbsenceLeave = 0;
    
    //         // If the current date is beyond the 1-year range, reset leave counts
    //         if (currentDate >= endDate) {
    //             totalSickLeave = 0;
    //             totalAbsenceLeave = 0;
    //             startDate.setFullYear(startDate.getFullYear() + 1);
    //             endDate.setFullYear(endDate.getFullYear() + 1);
    //         }
    
    //         // Fetch employee leaves in the valid date range
    //         const employeeLeaves = await AbsenceLeaveModule.find({
    //             employeeId,
    //             startDate: { $gte: startDate, $lt: endDate },
    //         })
    //         .populate('employeeId')
    //         .sort({ createdAt: -1 });
    
    //         // Calculate total sick & absence leave
    //         employeeLeaves.forEach(record => {
    //             if (record.leaveType.toLowerCase() === 'sick') {
    //                 totalSickLeave += record.totalSickLeaveDays || 0;
    //             }
    //             if (record.leaveType.toLowerCase() === 'absent') {
    //                 totalAbsenceLeave += record.totalAbsenceLeaveDays || 0;
    //             }
    //         });
    
    //         res.json({
    //             employeeId,
    //             totalSickLeave,
    //             totalAbsenceLeave,
    //             resumeStartDate: startDate,
    //             allLeaveRecords: employeeLeaves
    //         });
    //     } catch (error) {
    //         console.error("Error in getTotalSickLeave:", error);
    //         return next(error);
    //     }
    // },
    
    
async getTotalSickLeave(req, res, next) {
    const employeeId = req.params.id;

    try {
        const currentDate = new Date();

        // Calendar year range: Jan 1 to Dec 31
        const startDate = new Date(currentDate.getFullYear(), 0, 1);
        const endDate = new Date(currentDate.getFullYear() + 1, 0, 1);

        let totalSickLeave = 0;
        let totalAbsenceLeave = 0;

        const employeeLeaves = await AbsenceLeaveModule.find({
            employeeId,
            startDate: { $gte: startDate, $lt: endDate },
        })
        .populate('employeeId')
        .sort({ createdAt: -1 });

        employeeLeaves.forEach(record => {
            const type = (record.leaveType || '').toLowerCase();

            if (type === 'sick') {
                totalSickLeave += record.totalSickLeaveDays || 0;
            }

            if (type === 'absent') {
                totalAbsenceLeave += record.totalAbsenceLeaveDays || 0;
            }
        });

        res.json({
            employeeId,
            year: currentDate.getFullYear(),
            totalSickLeave,
            totalAbsenceLeave,
            yearStartDate: startDate,
            yearEndDate: new Date(endDate.getTime() - 1),
            allLeaveRecords: employeeLeaves
        });

    } catch (error) {
        console.error("Error in getTotalSickLeave:", error);
        return next(error);
    }
},


// Get latest AbsenceLeave for each employee
 async getEmployeeLatestAbsenceLeave (req, res, next) {
    try {
        const lastAbsenceLeave = await AbsenceLeaveModule.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$employeeId",
                    latestAbsenceLeave: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$latestAbsenceLeave" } },
            {
                $lookup: {
                    from: "newEmployees",
                    localField: "employeeId",
                    foreignField: "_id",
                    as: "employeeDetails"
                }
            },
            {
                $unwind: {
                    path: "$employeeDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "employeeDetails.status": "Active"
                }
            }
        ]);
          // Ensure getters are applied
            const updatedLastAbsentLeave = lastAbsenceLeave.map((leave) => {
              if (leave.employeeDetails) {
                // Convert employeeDetails to a Mongoose Document and apply getters
                const employeeDoc = new newEmployee(leave.employeeDetails);
                leave.employeeDetails = employeeDoc.toJSON({ getters: true });
              } 
              return leave;
            });
        res.json({lastAbsenceLeave: updatedLastAbsentLeave });
    } catch (error) {
        console.error('❌ Error:', error);
        return next(error);
    }
}
}

module.exports = AbsenceLeaveController