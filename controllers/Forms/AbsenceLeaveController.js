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
            maternityLeaveStartDate:Joi.date().allow(null,''),
            maternityLeaveEndDate:Joi.date().allow(null,''), 
            totalMaternityLeaveDays:Joi.number().allow(null,''),
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
            maternityLeaveStartDate,
            maternityLeaveEndDate,
            totalMaternityLeaveDays,
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
                maternityLeaveStartDate,
                maternityLeaveEndDate,
                totalMaternityLeaveDays,
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
            maternityLeaveStartDate:Joi.date().allow(null,''),
            maternityLeaveEndDate:Joi.date().allow(null,''), 
            totalMaternityLeaveDays:Joi.number().allow(null,''),
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
            maternityLeaveStartDate,
            maternityLeaveEndDate,
            totalMaternityLeaveDays,
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
                maternityLeaveStartDate,
                maternityLeaveEndDate,
                totalMaternityLeaveDays,
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



    
async getTotalSickLeave(req, res, next) {
    const employeeId = req.params.id;
    try {
        const now = new Date();
        const year = now.getFullYear();
        // Calendar year range: Jan 1 to Dec 31
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);

        let totalSickLeave = 0;
        let totalAbsenceLeave = 0;
        let totalMaternityLeaveDays = 0;

        // Use the correct date field for filtering (likely 'date' not 'startDate')
        const employeeLeaves = await AbsenceLeaveModule.find({
            employeeId,
            date: { $gte: startDate, $lt: endDate },
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
            if (type === 'maternity') {
              totalMaternityLeaveDays += record.totalMaternityLeaveDays || 0;
            }
        });
         
        res.json({
            employeeId,
            year,
            totalSickLeave,
            totalAbsenceLeave,
            totalMaternityLeaveDays,
            yearStartDate: startDate,
            yearEndDate: new Date(endDate.getTime() - 1),
            allLeaveRecords: employeeLeaves
        });
    } catch (error) {
        console.error("Error in getTotalSickLeave:", error);
        return next(error);
    }
},

async getSickLeaveByDate(req,res,next){
  try { 
   
    const {startDate,endDate} = req.query;
    
    // Validate required query Parameters
    if(!startDate,!endDate){ 
      return res.status(400).json({
        success:false,
        message:"Please provide both StartDate and end Date in the query parameters.",
      });
    }
 
    //Parse dates 
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0); // Start of the day in local time
    end.setHours(23, 59, 59, 999); // End of the day in local time 
    const leaves = await AbsenceLeaveModule.aggregate([
      { 
        $match: {
          leaveStartDate: { $gte: start },
          leaveEndDate: { $lte: end },
        },
      },
      {
        $lookup: {
          from: 'newEmployees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employeeDetails',
        },
      },
      {
        $unwind: {
          path: '$employeeDetails',
          preserveNullAndEmptyArrays: false, // Remove records without an employee match
        }, 
      },
      {
        $match: {
        //   'employeeDetails.status': 'Active',
        "employeeDetails.status": { $in: ["Active", "Rejoin"] },
        },
      },
      {
        $project: {
          leaveType: 1,
          leaveStartDate: 1,
          leaveEndDate: 1,
          numberOfDayLeave:1,
          lastNumberOfDayLeave:1, 
    totalSickLeaveDays:1,
    totalAbsenceLeaveDays:1,
          comment:1,
          status: 1,
          createdAt: 1,
          employeeDetails: 1, // Retain renamed field
          
        },
      },
    ]);
      // Ensure getters are applied
      const EmployeeLeave = leaves.map((leave) => {
        if (leave.employeeDetails) {
          // Convert employeeDetails to a Mongoose Document and apply getters
          const employeeDoc = new newEmployee(leave.employeeDetails);
          leave.employeeDetails = employeeDoc.toJSON({ getters: true });
        } 
        return leave;
      });
  return res.status(200).json({ 
    success: true,
    message: 'Leaves fetched successfully.',
    data: EmployeeLeave,
  });
  
  } catch (error) {
    console.error('❌ Error:', error);
    return next(error)
    
  }
},

// Get latest AbsenceLeave for each employee
//  async getEmployeeLatestAbsenceLeave (req, res, next) {
//     try {
//         const lastAbsenceLeave = await AbsenceLeaveModule.aggregate([
//             { $sort: { createdAt: -1 } },
//             {
//                 $group: {
//                     _id: "$employeeId",
//                     latestAbsenceLeave: { $first: "$$ROOT" }
//                 }
//             },
//             { $replaceRoot: { newRoot: "$latestAbsenceLeave" } },
//             {
//                 $lookup: {
//                     from: "newEmployees",
//                     localField: "employeeId",
//                     foreignField: "_id",
//                     as: "employeeDetails"
//                 }
//             },
//             {
//                 $unwind: {
//                     path: "$employeeDetails",
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $match: {
//                     "employeeDetails.status": "Active"
//                 }
//             }
//         ]);
//           // Ensure getters are applied
//             const updatedLastAbsentLeave = lastAbsenceLeave.map((leave) => {
//               if (leave.employeeDetails) {
//                 // Convert employeeDetails to a Mongoose Document and apply getters
//                 const employeeDoc = new newEmployee(leave.employeeDetails);
//                 leave.employeeDetails = employeeDoc.toJSON({ getters: true });
//               } 
//               return leave;
//             });
//         res.json({lastAbsenceLeave: updatedLastAbsentLeave });
//     } catch (error) {
//         console.error('❌ Error:', error);
//         return next(error);
//     }
// }

async getEmployeeLatestAbsenceLeave(req, res, next) {
  try {
    // ✅ Current year start & end
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(
      new Date().getFullYear(),
      11,
      31,
      23,
      59,
      59
    );

    const lastAbsenceLeave = await AbsenceLeaveModule.aggregate([
      // ✅ Only current year data
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        },
      },

      // ✅ Latest record first
      { $sort: { createdAt: -1 } },

      // ✅ Latest absence leave per employee
      {
        $group: {
          _id: "$employeeId",
          latestAbsenceLeave: { $first: "$$ROOT" },
        },
      },

      // ✅ Replace root with latest record
      { $replaceRoot: { newRoot: "$latestAbsenceLeave" } },

      // ✅ Join employee details
      {
        $lookup: {
          from: "newEmployees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },

      // ✅ Unwind employee details
      {
        $unwind: {
          path: "$employeeDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ✅ Only active employees
      {
        $match: {
           "employeeDetails.status": { $in: ["Active", "Rejoin"] },
        },
      },
    ]);

    // ✅ Apply getters on employeeDetails
    const updatedLastAbsentLeave = lastAbsenceLeave.map((leave) => {
      if (leave.employeeDetails) {
        const employeeDoc = new newEmployee(leave.employeeDetails);
        leave.employeeDetails = employeeDoc.toJSON({ getters: true });
      }
      return leave;
    });

    return res.status(200).json({
      success: true,
      lastAbsenceLeave: updatedLastAbsentLeave,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return next(error);
  }
}

}

module.exports = AbsenceLeaveController