const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");
const EmployeeResumeModel = require("../../model/Forms/EmployeeResume");

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

const EmployeeResumeController = {
  //-----------------CreateAPi-------------------------------------
  async EmployeeResume(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      // let filePath = req.file.path;
// console.log(filePath,'llllllllllllllllllllll')
      const EmployeeResumeSchema = Joi.object({
        employeeId: Joi.objectId().required(), // ObjectId format
       
        leaveStartDate: Joi.date().required(),
        leaveEndDate: Joi.date().required(),
        resumeOfWorkDate: Joi.date().required(),
        comment: Joi.string().allow(null,''),
       
      });

      const { error } = EmployeeResumeSchema.validate(req.body);

      if (error) {
        fs.unlink(`${appRoot}/`, (err) => {
         
        });

        return next(error);
      }

      const {
        employeeId ,
        leaveStartDate,
        leaveEndDate,
        resumeOfWorkDate,
        comment
      } = req.body;

      let EmployeeResume;
      try {
        EmployeeResume = await EmployeeResumeModel.create({
        employeeId ,
        leaveStartDate,
        leaveEndDate,
        resumeOfWorkDate,
        comment
        });
      } catch (error) {
        return next(error);
      }

      res.status(201).json({ message: "Employee resume successfully", EmployeeResume: EmployeeResume });
    });
  },
  //--------------------ends services.Api----------------------------
  async UpdateEmployeeResume(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      let filePath;
      if (filePath) {
        filePath = req.file.path;
      }

      const UpdateEmployeeResumeSchema =Joi.object({
        employeeId: Joi.objectId().required(), // ObjectId format
        leaveStartDate: Joi.date().required(),
        leaveEndDate: Joi.date().required(),
        resumeOfWorkDate: Joi.date().required(),
        comment: Joi.string().allow(null,""),
      });


      const { error } = UpdateEmployeeResumeSchema.validate(req.body);
     
     
        if (error) {
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            if (err) {
              return next(error);
            }
          });

          return next(error);
        }
      

      const {
        employeeId ,
        leaveStartDate,
        leaveEndDate,
        resumeOfWorkDate,
        comment
      } = req.body;

      let UpdateEmployeeResume;
      try {
     

        UpdateEmployeeResume = await EmployeeResumeModel.findOneAndUpdate(
          { _id: req.params.id },
          {
            employeeId ,
            leaveStartDate,
            leaveEndDate,
            resumeOfWorkDate,
            comment
          },
          { new: true }
        );
      } catch (error) {
        return next(error);
      }

      res.status(201).json({ UpdateEmployeeResume: UpdateEmployeeResume });
    });
  },

  //----------------------Delete Api--------------------------
  async deleteEmployeeResume(req, res, next) {
  
    try {
      let  deleteEmployeeResume = await EmployeeResumeModel.findOneAndRemove({
        _id: req.params.id,
      });
      if (!deleteEmployeeResume) {
        return next(Error("Noting to delete."));
      }
    
      res.json({ deleteEmployeeResume: deleteEmployeeResume });
    } catch (error) {
      return next(error);
    }

  },
//   //---------------------All Employee API -------------------------
  async allEmployeeResume(req, res, next) {
    let allEmployeeResume;
    try {
        allEmployeeResume = await EmployeeResumeModel.find({})
        .select("-__V -updatedAt")
        .sort({ _id: -1 });
    } catch (error) {
      return next(error);
    }

    res.json({ allEmployeeResume: allEmployeeResume });
  },
  //----------------one employee------------------------
  async oneEmployeeResume(req, res, next) {
    let oneEmployeeResume;
    try {
        oneEmployeeResume = await EmployeeResumeModel.findOne({})
        .select("-__V -updatedAt")
        .sort({ _id: -1 });
    } catch (error) {
      return next(error);
    }

    res.json({ oneEmployeeResume: oneEmployeeResume });
  },

  // get last exit Resume entry

async getEmployeeResume(req,res,next){

  try{
      const {employeeId} = req.params
      const leaves = await EmployeeResumeModel.find({employeeId}).sort({createdAt:-1})
      if(leaves.length > 0){
        //Get the most recent leave entry
        const latestResume = leaves[0]
        res.json(latestResume)
      }else{
        res.status(404).json({message:"No Resume records found for this employee"})
      }
  }catch(error){
    res.status(500).json({ message: 'Server error', error });
  }
},
  
 async getEmployeeResumeinfo(req, res, next) {
    const employeeId = req.params.employeeId; // Extract employee ID from request params
    try {
      
      // Fetch data for the specific employee
      const employeeResume = await EmployeeResumeModel.find({ employeeId })

      .populate('employeeId') // Specify fields to populate
      .sort({ _id: -1 }); // Sort in descending order by creation time
      // Check if data exists for the given employeeId
      if (!employeeResume || employeeResume.length === 0) {
        return res.json({ message: "No annual settlements found for this employee." });
      }
  
      // Respond with the data
      res.status(200).json({ 
        message: `Annual settlements for employee ID: ${employeeId}`, 
        employeeResume 
      });
    } catch (error) {
      // Catch and handle errors
      console.error("Error fetching annual settlements:", error);
      return next(error);
    }
  },
};

module.exports = EmployeeResumeController;
