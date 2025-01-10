const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");
const Annualsettelment = require("../../model/Forms/Annualsettelment");
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
        subject: Joi.string().allow(null,""),
        to: Joi.string().required(),
        from: Joi.string().required(),
        leaveStartDate: Joi.date().required(),
        resumingVacation: Joi.date().required(),



      
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
        leaveStartDate,

        resumingVacation,

    
      } = req.body;

      let annualsettelment;
      try {

        const employee = await  newEmployee.findById(employeeId).select("name");
        if(!employee){
          return res.status(404).json({message:"Employee not found"})
        }
        annualsettelment = await Annualsettelment.create({
          employeeId,
          date,
          subject,
          to,
          from,
          leaveStartDate,
          resumingVacation,
        });
        res.status(201).json({
          message: `Annual settlement successfully added for ${employee.name}`,
          annualsettelment: annualsettelment
        });
      } catch (error) {
        return next(error);
      }

    
      
    });
  },
  //--------------------end of services.Api----------------------------
  async UpdateAnnualsettelment(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      // console.log(req.body)
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
        subject: Joi.string().allow(null,""),
        to: Joi.string().required(),
        from: Joi.string().required(),
        leaveStartDate: Joi.date().required(),
        resumingVacation: Joi.date().required(),
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
        leaveStartDate,

        resumingVacation,
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
            leaveStartDate,
    
            resumingVacation,
          },
          { new: true }
        );
      } catch (error) {
        return next(error);
      }

      res.status(201).json({message:"Update successfully", UpdateAnnualsettelment: UpdateAnnualsettelment });
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
      res.json({message:"Annual settlement information Scessfully deleted" ,deleteAnnualsettelment: deleteAnnualsettelment });
   
      
    } catch (error) {
      return next(error);
    }

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
  async getEmployeeAnnualSettlements(req, res, next) {
    const employeeId = req.params.employeeId; // Extract employee ID from request params
    try {
      
      // Fetch data for the specific employee
      const allAnnualsettelment = await Annualsettelment.find({ employeeId })

      .populate('employeeId') // Specify fields to populate
      .sort({ _id: -1 }); // Sort in descending order by creation time
      // Check if data exists for the given employeeId
      if (!allAnnualsettelment || allAnnualsettelment.length === 0) {
        return res.json({ message: "No annual settlements found for this employee." });
      }
  
      // Respond with the data
      res.status(200).json({ 
        message: `Annual settlements for employee ID: ${employeeId}`, 
        allAnnualsettelment 
      });
    } catch (error) {
      // Catch and handle errors
      console.error("Error fetching annual settlements:", error);
      return next(error);
    }
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

