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
    if (err) return next(err);

    const filePaths = {
      employeeImage: req.files.employeeImage ? req.files.employeeImage[0].path : null,
      employeePassport: req.files.employeePassport ? req.files.employeePassport[0].path : null,
      employeeQatarID: req.files.employeeQatarID ? req.files.employeeQatarID[0].path : null,
      employeeContractCopy: req.files.employeeContractCopy ? req.files.employeeContractCopy[0].path : null,
      employeeGraduationCertificate: req.files.employeeGraduationCertificate ? req.files.employeeGraduationCertificate[0].path : null,
    };

    try {
      let {
        name,
        arabicName,
        dateOfBirth,
        dateOfJoining,
        mobileNumber,
        maritalStatus,
        nationality,
        department,
        qatarID,
        qatarIdExpiry,
        idDesignation,
        salaryIncrement,
        probationDate,
        probationMonthofNumber,
        probationAmount,
        BasicSalary,
        HousingAmount,
        transportationAmount,
        otherAmount,
        visaType,
        passportNumber,
        passportDateOfIssue,
        passportDateOfExpiry,
        employeeNumber,
        position,
      } = req.body;

      // 🔹 Only Name is required
      if (!name || name.trim() === "") {
        Object.values(filePaths).forEach((fp) => fp && fs.unlinkSync(fp));
        return res.status(400).json({ message: "Name is required" });
      }

      // 🔹 Normalize fields for duplicate check
      const empNum = employeeNumber?.toString().trim().toLowerCase();
      const passportNum = passportNumber?.toString().trim();
      const qatarIdStr = qatarID?.toString().trim();

      // 🔹 Build conditions for duplicate check
      const conditions = [];
      if (empNum) {
        conditions.push({ employeeNumber: { $regex: `^${empNum}$`, $options: "i" } });
      }
      if (passportNum) {
        conditions.push({ passportNumber: { $regex: `^${passportNum}$`,$options: "i" } });
      }
      if (qatarIdStr) {
        conditions.push({ qatarID: qatarIdStr });
      }

      let existingEmployee = null;
      if (conditions.length > 0) {
        existingEmployee = await NewEmployee.findOne({ $or: conditions });
      }

      if (existingEmployee) {
        Object.values(filePaths).forEach((fp) => fp && fs.unlinkSync(fp));

        if (existingEmployee.employeeNumber?.toLowerCase() === empNum) {
          return res.status(400).json({
            message: `Employee Number already exists (assigned to ${existingEmployee.name})`,
          });
        }
        if (existingEmployee.qatarID == qatarIdStr) {
          return res.status(400).json({
            message: `Qatar ID already exists (assigned to ${existingEmployee.name})`,
          });
        }
        if (existingEmployee.passportNumber?.toLowerCase() === passportNum.toLowerCase()) {
          return res.status(400).json({
            message: `Passport Number already exists (assigned to ${existingEmployee.name})`,
          });
        }
      }

      // ✅ Create new employee
      const newEmployee = await NewEmployee.create({
        name,
        arabicName,
        dateOfBirth,
        dateOfJoining,
        mobileNumber,
        maritalStatus,
        nationality,
        department,
        qatarID: qatarIdStr,
        qatarIdExpiry,
        idDesignation,
        salaryIncrement,
        probationDate,
        probationMonthofNumber,
        probationAmount,
        BasicSalary,
        HousingAmount,
        transportationAmount,
        otherAmount,
        visaType,
        passportNumber: passportNum,
        passportDateOfIssue,
        passportDateOfExpiry,
        employeeNumber: empNum,
        position,
        ...filePaths,
      });

      res.status(201).json({
        message: "Employee added successfully",
        newEmployee,
      });

    } catch (error) {
      Object.values(filePaths).forEach((fp) => fp && fs.unlinkSync(fp));
      return next(error);
    }
  });
},



  //==================================================== Update Employee API ====================================================
async updateEmployee(req, res, next) {
  try {
    handleMultipartData(req, res, async (err) => {
      if (err) return next(err);

      const filePaths = {
        employeeImage: req.files?.employeeImage ? req.files.employeeImage[0].path : null,
        employeePassport: req.files?.employeePassport ? req.files.employeePassport[0].path : null,
        employeeQatarID: req.files?.employeeQatarID ? req.files.employeeQatarID[0].path : null,
        employeeContractCopy: req.files?.employeeContractCopy ? req.files.employeeContractCopy[0].path : null,
        employeeGraduationCertificate: req.files?.employeeGraduationCertificate
          ? req.files.employeeGraduationCertificate[0].path
          : null,
      };

      const existingEmployee = await NewEmployee.findById(req.params.id);
      if (!existingEmployee) return res.status(404).json({ message: 'Employee not found' });

      // 🔹 Duplicate check for employeeNumber, passportNumber, qatarID
      const empNum = req.body.employeeNumber?.toString().trim().toLowerCase();
      const passportNum = req.body.passportNumber?.toString().trim().toUpperCase();;
      const qatarIdStr = req.body.qatarID?.toString().trim();

      const conditions = [];
      if (empNum) conditions.push({ employeeNumber: { $regex: `^${empNum}$`, $options: "i" } });
      if (passportNum) conditions.push({ passportNumber: { $regex: `^${passportNum}$`, $options: "i" } });
      if (qatarIdStr) conditions.push({ qatarID: qatarIdStr });

      if (conditions.length > 0) {
        const duplicate = await NewEmployee.findOne({ $or: conditions, _id: { $ne: req.params.id } });
        if (duplicate) {
          Object.values(filePaths).forEach((fp) => fp && fs.unlinkSync(fp));
          if (duplicate.employeeNumber?.toLowerCase() === empNum) {
            return res.status(400).json({ message: `Employee Number already exists (assigned to ${duplicate.name})` });
          }
          if (duplicate.qatarID == qatarIdStr) {
            return res.status(400).json({ message: `Qatar ID already exists (assigned to ${duplicate.name})` });
          }
          if (duplicate.passportNumber?.toUpperCase() === passportNum) {
            return res.status(400).json({ message: `Passport Number already exists (assigned to ${duplicate.name}- ${duplicate.passportNumber})` });
          }
        }
      }

      // 🔹 Merge new file paths with existing ones
      const updateData = {
        ...req.body,
        employeeImage: filePaths.employeeImage || existingEmployee.employeeImage,
        employeePassport: filePaths.employeePassport || existingEmployee.employeePassport,
        employeeQatarID: filePaths.employeeQatarID || existingEmployee.employeeQatarID,
        employeeContractCopy: filePaths.employeeContractCopy || existingEmployee.employeeContractCopy,
        employeeGraduationCertificate:
          filePaths.employeeGraduationCertificate || existingEmployee.employeeGraduationCertificate,
        employeeNumber: empNum || existingEmployee.employeeNumber,
        passportNumber: passportNum || existingEmployee.passportNumber,
        qatarID: qatarIdStr || existingEmployee.qatarID,
      };

      const oldFilePaths = [
        existingEmployee.employeeImage,
        existingEmployee.employeePassport,
        existingEmployee.employeeQatarID,
        existingEmployee.employeeContractCopy,
        existingEmployee.employeeGraduationCertificate,
      ];

      oldFilePaths.forEach((oldFilePath, index) => {
        if (filePaths[Object.keys(filePaths)[index]] && oldFilePath) {
          const fullPath = path.resolve(__dirname, '..', '..', 'uploads', path.basename(oldFilePath));
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
      });

      const updatedEmployee = await NewEmployee.findByIdAndUpdate(req.params.id, updateData, { new: true });
      res.json({ message: 'Employee updated successfully', updatedEmployee });
    });
  } catch (error) {
    const filePathsArr = Object.values(filePaths);
    filePathsArr.forEach((filePath) => {
      if (filePath) fs.unlinkSync(filePath);
    });
    return next(error);
  }
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
      const allEmployees = await NewEmployee.find({
      status: { $in: ["Active", "Rejoin"] } // Active OR Rejoin
    }).select("-__v -updatedAt");

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
      const totalActiveEmployees = await NewEmployee.countDocuments({
         status: { $in: ["Active", "Rejoin"] } // Active OR Rejoin
      }
      )
      res.json({totalActiveEmployees})
    } catch (error) {
//  
      next(error)
    }
  }
};

module.exports = newEmployeeController;
