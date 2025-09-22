const multer = require("multer");
const EndofServices = require("../../model/Forms/endofServices");
const NewEmployee = require("../../model/Forms/newEmployee");
const fs = require("fs");
const path = require("path");

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
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

const endofServicesController = {
 
  //-----------------CreateAPi-------------------------------------
  async endofservices(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      // let filePath = req.file.path;

      const endofservicesSchema = Joi.object({
    //-----------endofServicesSchema--------------------
        employeeId: Joi.objectId().required(), // ObjectId format
        date:Joi.date().required(),
        subject: Joi.string().allow(null, ''),
        exitType: Joi.string().allow(null, ''),
        lastWorkingDate: Joi.date().required(),
        dateOfJoining: Joi.date().required(),
        resumingofLastVacation: Joi.date().allow(null, ''),
        other: Joi.string().allow(null, ''),


      });

      const { error } = endofservicesSchema.validate(req.body);

      if (error) {
        fs.unlink(`${appRoot}`, (err) => {
          if (err) {
            return next(error);
          }
        });

        return next(error);
      }

      const {
        employeeId,
        date,
        subject,
        exitType,
        lastWorkingDate,
        dateOfJoining,
        resumingofLastVacation,
        other,
  

      } = req.body;

      let endofservices;
      try {
        endofservices = await EndofServices.create({
          employeeId,
        date,
        subject,
        exitType,
        lastWorkingDate,
        dateOfJoining,
        resumingofLastVacation,
        other,
        });

        const UpdateEmployee = await NewEmployee.findByIdAndUpdate(
          employeeId,
          {status:"Deactive"},
          {new:true}
        )
        if(!UpdateEmployee){
          return next(new Error("Faild to update employee status"))
        }
      } catch (error) {
        return next(error);
      }

      res.status(201).json({message:"Employee successfully removed ", endofservices: endofservices });
    });
  },




// Controller
async updateStatus(req, res, next) {

  try {
    const { id } = req.params; // from URL

    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const updatedEmployee = await NewEmployee.findByIdAndUpdate(
      id,
      { status: "Rejoin" },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      message: "Employee rejoined successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while updating status",
      error: error.message,
    });
  }
},


async allRejoinEmployee(req, res, next) {

  try {
    const allRejoinEmployee = await NewEmployee.find({ status: "Rejoin" }).sort({_id:-1});

    return res.status(200).json({
      success: true,
      count: allRejoinEmployee.length,
      employees: allRejoinEmployee,
    });
  } catch (error) {
    console.error("Error fetching rejoin employees:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching rejoin employees",
      error: error.message,
    });
  }
},

  //--------------------endos services.Api----------------------------
  async UpdateEndofservices(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      let filePath;
      if (filePath) {
        filePath = req.file.path;
      }

      const UpdateEndofservices = Joi.object({
        employeeId: Joi.objectId().required(), // ObjectId format
        date:Joi.date().required(),
        subject: Joi.string().allow(null, ''),
        exitType: Joi.string().allow(null, ''),
        lastWorkingDate: Joi.date().required(),
        dateOfJoining: Joi.date().required(),
        resumingofLastVacation: Joi.date().allow(null, ''),
        other: Joi.string().allow(null, '')

    //---------------Prepared-----------------------
  
      });

      const { error } = UpdateEndofservices.validate(req.body);
     
     
        if (error) {
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            if (err) {
              return next(error);
            }
          });

          return next(error);
        }
      

      const {
        employeeId,
        date,
        subject,
        exitType,
        lastWorkingDate,
        dateOfJoining,
        resumingofLastVacation,
        other,
    
      } = req.body;

      let UpdateEndofservice;
      try {
     

        UpdateEndofservice = await EndofServices.findOneAndUpdate(
          { _id: req.params.id },
          {
            employeeId,
        date,
        subject,
        exitType,
        lastWorkingDate,
        dateOfJoining,
        resumingofLastVacation,
        other,
  
          },
          { new: true }
        );
      } catch (error) {
        return next(error);
      }

      res.status(201).json({ UpdateEndofservice: UpdateEndofservice });
    });
  },
 
  //----------------------Delete Api--------------------------
  async deleteEndofservice(req, res, next) {
    let deleteEndofservice;
    try {
        deleteEndofservice = await EndofServices.findOneAndRemove({
        _id: req.params.id,
      });
      if (!deleteEndofservice) {
        return next(Error("Noting to delete."));
      }
      const avatarpath = deleteEndofservice.avatar;

      fs.unlink(`${appRoot}/${avatarpath}`, (err) => {
        if (err) {
          return next(err);
        }
      });
    } catch (error) {
      return next(error);
    }

    res.json({ deleteEndofservice: deleteEndofservice });
  },
//   //---------------------All Employee API -------------------------
async allEndofservice(req, res, next) {
  try {
    let allEndofservice = await EndofServices.find({})
      .populate({
        path: "employeeId",
        match: { status: "Deactive" } // must match EXACT value in DB
      })
      .select("-__v -updatedAt")
      .sort({ _id: -1 });

    // Important: filter out those where employeeId === null
    allEndofservice = allEndofservice.filter(e => e.employeeId);

    res.json({ allEndofservice });
  } catch (error) {
    return next(error);
  }
},

  //----------------one employee------------------------
  async oneEndofservice(req, res, next) {
    let oneEndofservice;
    try {
        oneEndofservice = await EndofServices.findOne({
          _id:req.params.id,
        })
        .populate("employeeId")
        .select("-__V -updatedAt")
        .sort({ _id: -1 });
    } catch (error) {
      return next(error);
    }

    res.json({ oneEndofservice: oneEndofservice });
  },
  async getTotalExitEmployees(req,res,next){
    try {
      const totalExitEmployees = await NewEmployee.countDocuments({
        status:"Deactive"
      })
      res.json({totalExitEmployees})
    } catch (error) {

      next(error)
    }
  },
 
    
};

module.exports = endofServicesController;

