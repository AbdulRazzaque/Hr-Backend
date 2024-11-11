const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");
const Annualsettelment = require("../../model/Forms/Annualsettelment");

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

const AnnualsettelmentController = {
  //-----------------CreateAPi-------------------------------------
  async Annualsettelment(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }

     

      const AnnualsettelmentSchema = Joi.object({
        employeeId: Joi.objectId().required(), // ObjectId format
        date: Joi.date().required(),
        subject: Joi.string().required(),
        to: Joi.string().required(),
        from: Joi.string().required(),
        vacationStartDate: Joi.date().required(),
        joiningDate: Joi.date().required(),
        resumingVacation: Joi.date().required(),

        // hr 
        preparedName: Joi.string().required(),
        preparedDate: Joi.date().required(),
        hrName: Joi.string().required(),
        hrDate: Joi.date().required(),
        directorName: Joi.string().required(),
        directorDate: Joi.date().required(),
       

      
      });

      const { error } = AnnualsettelmentSchema.validate(req.body);

      if (error) {
        fs.unlink(`${appRoot}/`, (err) => {
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
        to,
        from,
        vacationStartDate,
        joiningDate,
        resumingVacation,
        preparedName,
        preparedDate,
        hrName,
        hrDate,
        directorName,
        directorDate,
    
      } = req.body;

      let annualsettelment;
      try {
        annualsettelment = await Annualsettelment.create({
          employeeId,
          date,
          subject,
          to,
          from,
          vacationStartDate,
          joiningDate,
          resumingVacation,
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

      res.status(201).json({ annualsettelment: annualsettelment });

    });
  },
  //--------------------endos services.Api----------------------------
  async UpdateAnnualsettelment(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      let filePath;
      if (filePath) {
        filePath = req.file.path;
      }

      const AnnualsettelmentSchema = Joi.object({
        employeeId: Joi.objectId().required(), // ObjectId format
        date: Joi.date().required(),
        subject: Joi.string().required(),
        to: Joi.string().required(),
        from: Joi.string().required(),
        vacationStartDate: Joi.date().required(),
        joiningDate: Joi.date().required(),
        resumingVacation: Joi.date().required(),

    // hr 
    preparedName: Joi.string().required(),
    preparedDate: Joi.date().required(),
    hrName: Joi.string().required(),
    hrDate: Joi.date().required(),
    directorName: Joi.string().required(),
    directorDate: Joi.date().required(),
   
      
      
      });

      const { error } = AnnualsettelmentSchema.validate(req.body);
     
     
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
        to,
        from,
        vacationStartDate,
        joiningDate,
        resumingVacation,
        preparedName,
        preparedDate,
        hrName,
        hrDate,
        directorName,
        directorDate,
      } = req.body;

      let UpdateAnnualsettelment;
      try {
     

        UpdateAnnualsettelment = await Annualsettelment.findOneAndUpdate(
          { _id: req.params.id },
          {
            employeeId,
            date,
            subject,
            to,
            from,
            vacationStartDate,
            joiningDate,
            resumingVacation,
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

      res.status(201).json({ UpdateAnnualsettelment: UpdateAnnualsettelment });
    });
  },

  //----------------------Delete Api--------------------------
  async deleteAnnualsettelment(req, res, next) {
    let deleteAnnualsettelment;
    try {
        deleteAnnualsettelment = await Annualsettelment.findOneAndRemove({
        _id: req.params.id,
      });
      if (!deleteAnnualsettelment) {
        return next(Error("Noting to delete."));
      }
      const avatarpath = deleteAnnualsettelment.avatar;

      fs.unlink(`${appRoot}/${avatarpath}`, (err) => {
        if (err) {
          return next(err);
        }
      });
    } catch (error) {
      return next(error);
    }

    res.json({ deleteAnnualsettelment: deleteAnnualsettelment });
  },
//   //---------------------All Employee API -------------------------
  async allAnnualsettelment(req, res, next) {
    let allAnnualsettelment;
    try {
        allAnnualsettelment = await Annualsettelment.find({})
        // .select("-__V -updatedAt")
        // .sort({ _id: -1 });
      } catch (error) {
        return next(error);
      }
      res.json({ allAnnualsettelment: allAnnualsettelment });

  },
  //----------------one employee------------------------
  async oneAnnualsettelment(req, res, next) {
    let oneAnnualsettelment;
    try {
        oneAnnualsettelment = await Annualsettelment.findOne({})
        .select("-__V -updatedAt")
        .sort({ _id: -1 });
    } catch (error) {
      return next(error);
    }

    res.json({ oneAnnualsettelment: oneAnnualsettelment });
  },
  
};

module.exports = AnnualsettelmentController;

