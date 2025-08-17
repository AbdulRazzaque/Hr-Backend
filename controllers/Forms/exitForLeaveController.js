const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");
const ExitofLeave = require("../../model/Forms/exitofLeave");
const exitofLeave = require("../../model/Forms/exitofLeave");
const newEmployee = require("../../model/Forms/newEmployee");
const moment = require('moment')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    // 3746674586-836534453.png
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("avatar"); // 5mb

const exitForLeaveController = {
  //-----------------CreateAPi-------------------------------------
  async exitofleave(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      // let filePath = req.file.path;

      const exitForLeaveSchema = Joi.object({
        employeeId: Joi.objectId().required(), // ObjectId format
        date: Joi.date().required(),
        leaveType: Joi.string().required(),
        leaveStartDate: Joi.string().required(),
        leaveEndDate: Joi.date().required(),
        numberOfDayLeave: Joi.string().required(),
        lastLeaveStartDate: Joi.date().required(),
        lastLeaveEndDate: Joi.date().required(),
        lastNumberOfDayLeave: Joi.number().required(),

        // Asset and Loan Info
        bankLoan: Joi.string().required(),
        personalLoan: Joi.string().required(),
        CreditCard: Joi.string().required(),
        companyAssetsLoan: Joi.string().required(),
        companyAssets: Joi.string().required(),
        companySimCard: Joi.string().required(),
        companyLaptop: Joi.string().required(),
        tools: Joi.string().required(),
        comment: Joi.string().allow(null, ''), // Allow empty string and null

        //  avatar: Joi.string().required(),
      });

      const { error } = exitForLeaveSchema.validate(req.body);

      if (error) {
        return next(error);
        }


      const {
        employeeId,
        date,
        leaveType,
        leaveStartDate,
        leaveEndDate,
        numberOfDayLeave,
        lastLeaveStartDate,
        lastLeaveEndDate,
        lastNumberOfDayLeave,

        // Asset and Loan Info
        bankLoan,
        personalLoan,
        CreditCard,
        companyAssetsLoan,
        companyAssets,
        companySimCard,
        companyLaptop,
        tools,
        comment,
      } = req.body;

    console.log(req.body)
      try {
       // 1️⃣ Pehle latest existing leave nikal lo
      const latestLeave = await ExitofLeave.findOne({ employeeId }).sort({ _id: -1 });

      // 2️⃣ Agar mila to previous leave ka data update karo
      if (latestLeave) {
        latestLeave.leaveStartDate = lastLeaveStartDate;
        latestLeave.leaveEndDate = lastLeaveEndDate;
        latestLeave.numberOfDayLeave = lastNumberOfDayLeave;
        await latestLeave.save();
        // console.log("Previous leave updated successfully:", latestLeave);
      }

        // Create a new exit leave entry
      const  exitofleave = await ExitofLeave.create({
          employeeId,
          date,
          leaveType,
          leaveStartDate,
          leaveEndDate,
          numberOfDayLeave,
          lastLeaveStartDate,
          lastLeaveEndDate,
          lastNumberOfDayLeave,
  
          // Asset and Loan Info
          bankLoan,
          personalLoan,
          CreditCard,
          companyAssetsLoan,
          companyAssets,
          companySimCard,
          companyLaptop,
          tools,
          comment,
        });
      res.status(201).json({ message: "Exit leave successfully added", exitofleave: exitofleave });

      } catch (error) {
        return next(error);
      }


    });
  },
  //--------------------updateApi----------------------------
  async updateExitofleave(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      let filePath;
      if (filePath) {
        filePath = req.file.path;
      }

      const exitForLeaveSchema = Joi.object({
        employeeId: Joi.objectId().required(), // ObjectId format
        date: Joi.date().required(),
        leaveType: Joi.string().required(),
        leaveStartDate: Joi.string().required(),
        leaveEndDate: Joi.date().required(),
        numberOfDayLeave: Joi.string().required(),
        lastLeaveStartDate: Joi.date().required(),
        lastLeaveEndDate: Joi.date().required(),
        lastNumberOfDayLeave: Joi.number().required(),

        // Asset and Loan Info
        bankLoan: Joi.string().required(),
        personalLoan: Joi.string().required(),
        CreditCard: Joi.string().required(),
        companyAssetsLoan: Joi.string().required(),
        companyAssets: Joi.string().required(),
        companySimCard: Joi.string().required(),
        companyLaptop: Joi.string().required(),
        tools: Joi.string().required(),
        comment: Joi.string().optional(),
      });

      const { error } = exitForLeaveSchema.validate(req.body);
      if (filePath) {
        if (error) {
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            if (err) {
              return next(error);
            }
          });

          return next(error);
        }
      }

      const {
        employeeId,
        date,
        leaveType,
        leaveStartDate,
        leaveEndDate,
        numberOfDayLeave,
        lastLeaveStartDate,
        lastLeaveEndDate,
        lastNumberOfDayLeave,

        // Asset and Loan Info
        bankLoan,
        personalLoan,
        CreditCard,
        companyAssetsLoan,
        companyAssets,
        companySimCard,
        companyLaptop,
        tools,
        comment,
      } = req.body;

    
      try {

        const existingLeave = await ExitofLeave.findById(req.params.id)
        if(!existingLeave) {
          return res.send({message:"Leave recode not fond"})
        }
        // update the entry while storing the previous leaveEndDate
      const  updateExitOfLeave = await ExitofLeave.findOneAndUpdate(
          { _id: req.params.id },
          {
          
          
         $set: {
          previousLeaveEndDate: existingLeave.leaveEndDate, // Store old value
            employeeId,
            date,
            leaveType,
            leaveStartDate,
            leaveEndDate,
            numberOfDayLeave,
            lastLeaveStartDate,
            lastLeaveEndDate,
            lastNumberOfDayLeave,
    
            // Asset and Loan Info
            bankLoan,
            personalLoan,
            CreditCard,
            companyAssetsLoan,
            companyAssets,
            companySimCard,
            companyLaptop,
            tools,
            comment,
          },
        },
          { new: true }
        );
        res.status(201).json({ updateExitOfLeave });
      } catch (error) {
        return next(error);
      }

    });
  },

  //----------------------Delete Api--------------------------


async  deleteExitofleave(req, res, next) {
    try {
        const deleteExitofleave = await ExitofLeave.findOneAndRemove({ _id: req.params.id });

        if (!deleteExitofleave) {
            return next(new Error("Nothing to delete."));
        }

        // Delete the file and send the response inside the fs.unlink callback
       
            res.json({ msg: "Deleted successfully", deleteExitofleave });
          }
     catch (error) {
        return next(error);
    }
},

  //---------------------All Employee API -------------------------
  async allExitofleave(req, res, next) {
    let allExitofleave;
    try {
        allExitofleave = await ExitofLeave.find({})
       
        .select("-__V -updatedAt")
        .sort({ _id: -1 });

        res.json({ allExitofleave: allExitofleave });
    } catch (error) {
      return next(error);
    }

  },
  //----------------one employee------------------------
  async oneExitofleave(req, res, next) {
    let oneExitofleave;
    try {
        oneExitofleave = await ExitofLeave.findOne({})
        .select("-__V -updatedAt")
        .sort({ _id: -1 });
    } catch (error) {
      return next(error);
    }
  //  res.status(200).send({msg:"success",result:response})
    res.json({ oneExitofleave: oneExitofleave });
  },


  async getEmployeeByIdExitLeave(req,res,next){
    const employeeId = req.params.employeeId;
    try {
      const allExitOfLeave = await ExitofLeave.find({employeeId})
      .populate('employeeId')
      .sort({_id: -1})
      if(!allExitOfLeave || allExitOfLeave.length === 0){
        return res.json({message:"NO exit leave found for this employee."})
      }

      res.status(200).json({
        message: `Annual settlements for employee ID: ${employeeId}`, 
        allExitOfLeave 
      })
    } catch (error) {
      console.error("Error fetching annual settlements:", error);
      return next(error);
    }
  },

// get last exit leave entry

async getEmployeeLeave(req,res,next){

  try{
      const {employeeId} = req.params
      const leaves = await exitofLeave.find({employeeId}).sort({createdAt:-1})
      if(leaves.length > 0){
        //Get the most recent leave entry
        const latestLeave  = leaves[0]
        res.json(latestLeave)
      }else{
        res.json({message:"No leave records found for this employee"})
      }
  }catch(error){
    res.status(500).json({ message: 'Server error', error });
  }
},

async CheckEligibleEmployee(req,res,next){
  const id = req.params.id
  const fiveYearsLater = moment().subtract(5, 'years'); // Date 5 years ago
  const employee = await newEmployee.find({_id:id});
  if(!employee){
    return res.status(404).json({ message: "Employee not found" });
  }

  const eligibilityMessage = moment(employee[0].dateOfJoining).isBefore(fiveYearsLater)
  ? " eligible for 28 days of leave"
  : " eligible for 21 days of leave";
  return res.send(eligibilityMessage)
} ,

async getEmployeeLatestLeave(req, res, next) {
  
  try {
    const lastLeave = await exitofLeave.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$employeeId",
          latestLeave: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$latestLeave" } },
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
    const updatedLastLeave = lastLeave.map((leave) => {
      if (leave.employeeDetails) {
        // Convert employeeDetails to a Mongoose Document and apply getters
        const employeeDoc = new newEmployee(leave.employeeDetails);
        leave.employeeDetails = employeeDoc.toJSON({ getters: true });
      } 
      return leave;
    });

    res.json({ lastLeave: updatedLastLeave });  
  } catch (error) {
    console.error('❌ Error:', error);
    return next(error);
  }
},

async getLeaveByDate(req,res,next){
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
    const leaves = await exitofLeave.aggregate([
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
          'employeeDetails.status': 'Active',
        },
      },
      {
        $project: {
          leaveType: 1,
          leaveStartDate: 1,
          leaveEndDate: 1,
          numberOfDayLeave:1,
          lastNumberOfDayLeave:1,
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
}


};

module.exports = exitForLeaveController;

