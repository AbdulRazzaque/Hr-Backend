const multer = require("multer");
const NewEmployee = require("../../model/Forms/newEmployee");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");

// Configure storage for multiple files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Configure multer for multiple file fields
const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 }, // 5 MB
}).fields([
  { name: "employeeImage", maxCount: 1 },
  { name: "employeePassport", maxCount: 1 },
  { name: "employeeQatarID", maxCount: 1 },
  { name: "employeeContractCopy", maxCount: 1 },
  { name: "employeeGraduationCertificate", maxCount: 1 },
]);

const newEmployeeController = {
  //==================================================== Create Employee API ====================================================
  async newEmployee(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      // console.log(req.body)
      if (err) return next(err);

      // Paths for uploaded files
      // Paths for uploaded files
      const filePaths = {
        employeeImage: req.files.employeeImage ? req.files.employeeImage[0].path : null,
        employeePassport: req.files.employeePassport ? req.files.employeePassport[0].path : null,
        employeeQatarID: req.files.employeeQatarID ? req.files.employeeQatarID[0].path : null,
        employeeContractCopy: req.files.employeeContractCopy ? req.files.employeeContractCopy[0].path : null,
        employeeGraduationCertificate: req.files.employeeGraduationCertificate ? req.files.employeeGraduationCertificate[0].path : null,
      };

      // Validation schema
      const EmployeeSchema = Joi.object({
        name: Joi.string().required(),
        arabicName: Joi.string().required(),
        dateOfBirth: Joi.date().required(),
        dateOfJoining: Joi.date().required(),
        mobileNumber: Joi.number().required(),
        maritalStatus: Joi.string().required(),
        nationality: Joi.string().required(),
        department: Joi.string().required(),


        // Allow qatarID and qatarIdExpiry to be optional
            qatarID: Joi.number().allow(null, ''),
            qatarIdExpiry: Joi.date().allow(null, ''),

        probationDate: Joi.date().required(),
        probationMonthofNumber: Joi.number().required(),
        probationAmount: Joi.number().required(),

        BasicSalary: Joi.number().required(),
        HousingAmount: Joi.number().required(),
        transportationAmount: Joi.number().required(),
        otherAmount: Joi.number().required(),
        visaType: Joi.string().required(),

        passportNumber: Joi.string().required(),
        passportDateOfIssue: Joi.date().required(),
        // passportPlaceOfIssue: Joi.string().required(),
        passportDateOfExpiry: Joi.date().required(),

        // bloodGroup: Joi.string().required(),
        employeeNumber: Joi.number().required(),
        position: Joi.string().required(),
      });

      const { error } = EmployeeSchema.validate(req.body);
      if (error) {
        // Only unlink files if the paths exist
        Object.values(filePaths).forEach((filePath) => {
          if (filePath) {
            fs.unlinkSync(filePath); // Delete only if file path exists
          }
        });
        return next(error);
      }
      try {
        const newEmployee = await NewEmployee.create({
          ...req.body,
          ...filePaths,
        });
        res.status(201).json({ message: "Employee added successfully", newEmployee });
      } catch (error) {
        // Delete the files if an error occurs during the creation process
        Object.values(filePaths).forEach((filePath) => {
          if (filePath) {
            fs.unlinkSync(filePath); // Delete only if file path exists
          }
        });
        return next(error);
      }
    });
  },



  //==================================================== Update Employee API ====================================================
  async updateEmployee(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) return next(err);

      const filePaths = {
        employeeImage: req.files.employeeImage ? req.files.employeeImage[0].path : null,
        employeePassport: req.files.employeePassport ? req.files.employeePassport[0].path : null,
        employeeQatarID: req.files.employeeQatarID ? req.files.employeeQatarID[0].path : null,
        employeeContractCopy: req.files.employeeContractCopy ? req.files.employeeContractCopy[0].path : null,
        employeeGraduationCertificate: req.files.employeeGraduationCertificate ? req.files.employeeGraduationCertificate[0].path : null,
      };

      // Validation schema
      const EmployeeSchema = Joi.object({
        name: Joi.string().required(),
        arabicName: Joi.string().required(),
        dateOfBirth: Joi.date().required(),
        dateOfJoining: Joi.date().required(),
        mobileNumber: Joi.number().required(),
        maritalStatus: Joi.string().required(),
        nationality: Joi.string().required(),
        department: Joi.string().required(),

        probationDate: Joi.date().required(),
        probationMonthofNumber: Joi.number().required(),
        probationAmount: Joi.number().required(),

        BasicSalary: Joi.number().required(),
        HousingAmount: Joi.number().required(),
        transportationAmount: Joi.number().required(),
        otherAmount: Joi.number().required(),
        visaType: Joi.string().required(),

     
       // Allow qatarID and qatarIdExpiry to be optional
        qatarID: Joi.string().allow(null, ''),
        qatarIdExpiry: Joi.date().allow(null, ''),

        passportNumber: Joi.string().required(),
        passportDateOfIssue: Joi.date().required(),
        // passportPlaceOfIssue: Joi.string().required(),
        passportDateOfExpiry: Joi.date().required(),

        // bloodGroup: Joi.string().required(),
        employeeNumber: Joi.number().required(),
        position: Joi.string().required(),
      });

      const { error } = EmployeeSchema.validate(req.body);
      if (error) {
        Object.values(filePaths).forEach((filePath) => {
          if (filePath) fs.unlinkSync(filePath);
        });
        return next(error);
      }

      try {
        const updateData = {
          ...req.body,
          ...filePaths,
        };

        const updatedEmployee = await NewEmployee.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );

        res.json({ updatedEmployee });
      } catch (error) {
        return next(error);
      }
    });
  },

  //==================================================== Delete Employee API ====================================================
  
  
  async  deleteEmployee(req, res, next) {
    try {
      // Find the employee by ID
      const deleteEmployee = await NewEmployee.findById(req.params.id);
  
      // Check if the employee exists
      if (!deleteEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      // Define paths of files to delete
      const filePaths = [
        deleteEmployee.employeeImage,
        deleteEmployee.employeePassport,
        deleteEmployee.employeeQatarID,
        deleteEmployee.employeeContractCopy,
        deleteEmployee.employeeGraduationCertificate,
      ];
  
      filePaths.forEach((filePath) => {
        if (filePath) {
          // Construct the absolute path for the file
          const fullPath = path.resolve(__dirname, "..", "..", "uploads", path.basename(filePath));
  
          // console.log(`Attempting to delete file at path: ${fullPath}`); // Debugging log
  
          // Check if file exists before attempting to delete
          if (fs.existsSync(fullPath)) {
            try {
              fs.unlinkSync(fullPath);
              // console.log(`Successfully deleted file: ${fullPath}`);
            } catch (err) {
              console.error(`Error deleting file ${fullPath}:`, err);
            }
          } else {
            console.warn(`File not found at path: ${fullPath}`);
          }
        }
      });
  
      // Delete employee from the database
      await NewEmployee.findByIdAndRemove(req.params.id);
  
      // Send success response
      res.status(200).json({ message: "Employee and associated files deleted successfully" });
    } catch (error) {
      return next(error);
    }
  },
  //==================================================== Get All Employees API ====================================================
  async allEmployee(req, res, next) {
    try {
      const allEmployees = await NewEmployee.find()
        .select("-__v -updatedAt")
        .sort({ _id: -1 });

      res.json({ employees: allEmployees });
    } catch (error) {
      return next(error);
    }
  },

  //==================================================== Get Single Employee API ====================================================
  async oneEmployee(req, res, next) {
    try {
      const employee = await NewEmployee.findById(req.params.id).select("-__v -updatedAt");
      if (!employee) return res.status(404).json({ message: "Employee not found" });

      res.json({ employee });
    } catch (error) {
      return next(error);
    }
  },

  async getTotalActiveEmployees(req,res,next){
    try {
      const totalActiveEmployees = await NewEmployee.countDocuments({status:"Active"})
      res.json({totalActiveEmployees})
    } catch (error) {

      next(error)
    }
  }
};

module.exports = newEmployeeController;
