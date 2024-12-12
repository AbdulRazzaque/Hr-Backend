const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");
const EmployeeResume = require("../../model/Forms/EmployeeResume");
const RprenewalformModel = require("../../model/Forms/Rprenewalform");
const newEmployee = require("../../model/Forms/newEmployee");


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

const RprenewalformController = {
  //-----------------CreateAPi-------------------------------------
  async Rprenewalform(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      // let filePath = req.file.path;
// console.log(filePath,'llllllllllllllllllllll')
      const RprenewalformSchema = Joi.object({
        employeeId: Joi.objectId().required(),
        date: Joi.date().required(),
        newVisaRequested: Joi.string().required(),
        BusinessVisaRequested: Joi.string().required(),
        TransferVisaRequested: Joi.string().required(),
        NewRPRequested: Joi.string().required(),
        RPRenewalRequested: Joi.string().required(),
        exitPermitRequested: Joi.string().required(),
        OthersRequested: Joi.string().required(),
        comment: Joi.string().allow(null,''),
        
      });

      const { error } = RprenewalformSchema.validate(req.body);

      if (error) {
        fs.unlink(`${appRoot}`, (err) => {
          if (err) {
            return next(error);
          }
        });

        return next(error);
      }

      const {
        employeeId ,
        date,
        newVisaRequested,
        BusinessVisaRequested,
        TransferVisaRequested,
        NewRPRequested,
        RPRenewalRequested,
        exitPermitRequested,
        OthersRequested,
        comment,
      } = req.body;

      let Rprenewalform;
       // Retrieve employee details using the employeeId
    const employee = await newEmployee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
      try {
        Rprenewalform = await RprenewalformModel.create({
          employeeId ,
          date,
          newVisaRequested,
          BusinessVisaRequested,
          TransferVisaRequested,
          NewRPRequested,
          RPRenewalRequested,
          exitPermitRequested,
          OthersRequested,
          comment,
        });
        res.status(201).json({
          message: `RP renewal successfully created for ${employee.name}`,
          Rprenewalform: Rprenewalform,
        });
      } catch (error) {
        return next(error);
      }

  
    });
  },
  //--------------------endos services.Api----------------------------
  async UpdateRprenewalform(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      let filePath;
      if (filePath) {
        filePath = req.file.path;
      }

      const UpdateRprenewalformSchema = Joi.object({
        employeeId: Joi.objectId().required(),
        date: Joi.date().required(),
        newVisaRequested: Joi.string().required(),
        BusinessVisaRequested: Joi.string().required(),
        TransferVisaRequested: Joi.string().required(),
        NewRPRequested: Joi.string().required(),
        RPRenewalRequested: Joi.string().required(),
        exitPermitRequested: Joi.string().required(),
        OthersRequested: Joi.string().required(),
        comment: Joi.string().allow(null,''),
        
       
      });


      const { error } = UpdateRprenewalformSchema.validate(req.body);
     
     
        if (error) {
          fs.unlink(`${appRoot}`, (err) => {
            if (err) {
              return next(error);
            }
          });

          return next(error);
        }
      

      const {
        employeeId ,
        date,
        newVisaRequested,
        BusinessVisaRequested,
        TransferVisaRequested,
        NewRPRequested,
        RPRenewalRequested,
        exitPermitRequested,
        OthersRequested,
        comment,
      } = req.body;

      let UpdateRprenewalform;
      try {
     

        UpdateRprenewalform = await RprenewalformModel.findOneAndUpdate(
          { _id: req.params.id },
          {
            employeeId ,
            date,
            newVisaRequested,
            BusinessVisaRequested,
            TransferVisaRequested,
            NewRPRequested,
            RPRenewalRequested,
            exitPermitRequested,
            OthersRequested,
            comment,
          },
          { new: true }
        );
      } catch (error) {
        return next(error);
      }

      res.status(201).json({ UpdateRprenewalform: UpdateRprenewalform });
    });
  },

  //----------------------Delete Api--------------------------
  async deleteUpdateRprenewalform(req, res, next) {
    let deleteUpdateRprenewalform;
    try {
        deleteUpdateRprenewalform = await RprenewalformModel.findOneAndRemove({
        _id: req.params.id,
      });
      if (!deleteUpdateRprenewalform) {
        return next(Error("Noting to delete."));
      }
      const avatarpath = deleteUpdateRprenewalform.avatar;

      fs.unlink(`${appRoot}/${avatarpath}`, (err) => {
        if (err) {
          return next(err);
        }
      });
    } catch (error) {
      return next(error);
    }

    res.json({ deleteUpdateRprenewalform: deleteUpdateRprenewalform });
  },
//   //---------------------All Employee API -------------------------
  async allRprenewalform(req, res, next) {
    let allRprenewalform;
    try {
        allRprenewalform = await RprenewalformModel.find({})
        .select("-__V -updatedAt")
        .sort({ _id: -1 });
    } catch (error) {
      return next(error);
    }

    res.json({ allRprenewalform: allRprenewalform });
  },
  //----------------one employee------------------------
  async oneRprenewalform(req, res, next) {
    let oneRprenewalform;
    try {
        oneRprenewalform = await RprenewalformModel.findOne({})
        .select("-__V -updatedAt")
        .sort({ _id: -1 });
    } catch (error) {
      return next(error);
    }

    res.json({ oneRprenewalform: oneRprenewalform });
  },
  
};

module.exports = RprenewalformController;

