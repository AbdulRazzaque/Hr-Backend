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
        company: Joi.string().required(),
        leaveStartDate: Joi.date().required(),
        leaveEndtDate: Joi.date().required(),
        resumeOfWorkDate: Joi.date().required(),
        comment: Joi.string().required(),
       
      });

      const { error } = EmployeeResumeSchema.validate(req.body);

      if (error) {
        fs.unlink(`${appRoot}/`, (err) => {
         
        });

        return next(error);
      }

      const {
        employeeId ,
        company,
        leaveStartDate,
        leaveEndtDate,
        resumeOfWorkDate,
        comment
      } = req.body;

      let EmployeeResume;
      try {
        EmployeeResume = await EmployeeResumeModel.create({
        employeeId ,
        company,
        leaveStartDate,
        leaveEndtDate,
        resumeOfWorkDate,
        comment
        });
      } catch (error) {
        return next(error);
      }

      res.status(201).json({ EmployeeResume: EmployeeResume });
    });
  },
  //--------------------endos services.Api----------------------------
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
        company: Joi.string().required(),
        leaveStartDate: Joi.date().required(),
        leaveEndtDate: Joi.date().required(),
        resumeOfWorkDate: Joi.date().required(),
        comment: Joi.string().required(),
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
        company,
        leaveStartDate,
        leaveEndtDate,
        resumeOfWorkDate,
        comment
      } = req.body;

      let UpdateEmployeeResume;
      try {
     

        UpdateEmployeeResume = await EmployeeResumeModel.findOneAndUpdate(
          { _id: req.params.id },
          {
            employeeId ,
            company,
            leaveStartDate,
            leaveEndtDate,
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
    let deleteEmployeeResume;
    try {
        deleteEmployeeResume = await EmployeeResumeModel.findOneAndRemove({
        _id: req.params.id,
      });
      if (!deleteEmployeeResume) {
        return next(Error("Noting to delete."));
      }
      const avatarpath = deleteEmployeeResume.avatar;

      fs.unlink(`${appRoot}/${avatarpath}`, (err) => {
        if (err) {
          return next(err);
        }
      });
    } catch (error) {
      return next(error);
    }

    res.json({ deleteEmployeeResume: deleteEmployeeResume });
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
  
};

module.exports = EmployeeResumeController;
