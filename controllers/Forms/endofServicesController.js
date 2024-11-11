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
        subject: Joi.string().required(),
        exitType: Joi.string().required(),
        lastWorkingDate: Joi.date().required(),
        dateOfJoining: Joi.date().required(),
        resumingofLastVacation: Joi.date().required(),
        other: Joi.string().required(),

    //---------------Prepared-----------------------
        preparedName: Joi.string().required(),
        preparedDate: Joi.date().required(),
        hrName: Joi.string().required(),
        hrDate: Joi.date().required(),
        directorName: Joi.string().required(),
        directorDate: Joi.date().required(),
        // avatar: Joi.string().required(),
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
        preparedName,
        preparedDate,
        hrName,
        hrDate,
        directorName,
        directorDate,

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
        preparedName,
        preparedDate,
        hrName,
        hrDate,
        directorName,
        directorDate,
        });
      } catch (error) {
        return next(error);
      }

      res.status(201).json({ endofservices: endofservices });
    });
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
        subject: Joi.string().required(),
        exitType: Joi.string().required(),
        lastWorkingDate: Joi.date().required(),
        dateOfJoining: Joi.date().required(),
        resumingofLastVacation: Joi.date().required(),
        other: Joi.string().required(),

    //---------------Prepared-----------------------
        preparedName: Joi.string().required(),
        preparedDate: Joi.date().required(),
        hrName: Joi.string().required(),
        hrDate: Joi.date().required(),
        directorName: Joi.string().required(),
        directorDate: Joi.date().required(),
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
        preparedName,
        preparedDate,
        hrName,
        hrDate,
        directorName,
        directorDate,
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
        preparedName,
        preparedDate,
        hrName,
        hrDate,
        directorName,
        directorDate,
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
    let allEndofservice;
    try {
        allEndofservice = await EndofServices.find({})
        .select("-__V -updatedAt")
        .sort({ _id: -1 });
    } catch (error) {
      return next(error);
    }

    res.json({ allEndofservice: allEndofservice });
  },
  //----------------one employee------------------------
  async oneEndofservice(req, res, next) {
    let oneEndofservice;
    try {
        oneEndofservice = await EndofServices.findOne({})
        .select("-__V -updatedAt")
        .sort({ _id: -1 });
    } catch (error) {
      return next(error);
    }

    res.json({ oneEndofservice: oneEndofservice });
  },
  
};

module.exports = endofServicesController;

