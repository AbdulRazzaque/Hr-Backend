const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");
const ExitofLeave = require("../../model/Forms/exitofLeave");


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
        comment: Joi.string().required(),

        //  avatar: Joi.string().required(),
      });

      const { error } = exitForLeaveSchema.validate(req.body);

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

      let exitofleave;
      try {
        exitofleave = await ExitofLeave.create({
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
      } catch (error) {
        return next(error);
      }

      res.status(201).json({ exitofleave: exitofleave });
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
        comment: Joi.string().required(),
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

      let updateExitofleave;
      try {
        updateExitofleave = await ExitofLeave.findOneAndUpdate(
          { _id: req.params.id },
          {
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
          { new: true }
        );
      } catch (error) {
        return next(error);
      }

      res.status(201).json({ updateExitofleave: updateExitofleave });
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
};

module.exports = exitForLeaveController;

