const Joi = require("joi")
const AbsenceLeaveModule = require("../../model/Forms/AbsenceLeaveModule");
const newEmployee = require("../../model/Forms/newEmployee");
const EmployeeResumeModel = require("../../model/Forms/EmployeeResume");


const AbsenceLeaveController = {

  async AbsenceLeave(req, res, next) {
    const AbsenceLeaveSchema = Joi.object({
      employeeId: Joi.objectId().required(), // ObjectId format
      date: Joi.date().required(),
      leaveType: Joi.string().required(),
      leaveStartDate: Joi.date().allow(null, ''),
      leaveEndDate: Joi.date().allow(null, ''),
      totalSickLeaveDays: Joi.number().allow(null, ''),
      AbsenceLeaveStartDate: Joi.date().allow(null, ''),
      AbsenceLeaveEndDate: Joi.date().allow(null, ''),
      totalAbsenceLeaveDays: Joi.number().allow(null, ''),
      maternityLeaveStartDate: Joi.date().allow(null, ''),
      maternityLeaveEndDate: Joi.date().allow(null, ''),
      totalMaternityLeaveDays: Joi.number().allow(null, ''),
      comment: Joi.string().allow(null, '')
    });

    const { error } = AbsenceLeaveSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      employeeId,
      date,
      leaveType,
      leaveStartDate,
      leaveEndDate,
      totalSickLeaveDays,
      AbsenceLeaveStartDate,
      AbsenceLeaveEndDate,
      totalAbsenceLeaveDays,
      maternityLeaveStartDate,
      maternityLeaveEndDate,
      totalMaternityLeaveDays,
      comment
    } = req.body;

    const normalizedType = leaveType ? leaveType.trim().toLowerCase() : '';

    if (normalizedType === 'sick') {
      if (!leaveStartDate) {
        return res.status(400).json({ message: "Leave Start Date is required." });
      }
      if (!leaveEndDate) {
        return res.status(400).json({ message: "Leave End Date is required." });
      }
      const start = new Date(leaveStartDate);
      const end = new Date(leaveEndDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid Leave Start Date." });
      }
      if (isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid Leave End Date." });
      }
      const sOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const eOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      if (eOnly < sOnly) {
        return res.status(400).json({ message: "End Date must never be earlier than Start Date." });
      }
    } else if (normalizedType === 'absent') {
      if (!AbsenceLeaveStartDate) {
        return res.status(400).json({ message: "Leave Absent Start Date is required." });
      }
      if (!AbsenceLeaveEndDate) {
        return res.status(400).json({ message: "Leave Absent End Date is required." });
      }
      const start = new Date(AbsenceLeaveStartDate);
      const end = new Date(AbsenceLeaveEndDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid Leave Absent Start Date." });
      }
      if (isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid Leave Absent End Date." });
      }
      const sOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const eOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      if (eOnly < sOnly) {
        return res.status(400).json({ message: "End Date must never be earlier than Start Date." });
      }
    } else if (normalizedType === 'maternity') {
      if (!maternityLeaveStartDate) {
        return res.status(400).json({ message: "Leave Maternity Start Date is required." });
      }
      if (!maternityLeaveEndDate) {
        return res.status(400).json({ message: "Leave Maternity End Date is required." });
      }
      const start = new Date(maternityLeaveStartDate);
      const end = new Date(maternityLeaveEndDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid Leave Maternity Start Date." });
      }
      if (isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid Leave Maternity End Date." });
      }
      const sOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const eOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      if (eOnly < sOnly) {
        return res.status(400).json({ message: "End Date must never be earlier than Start Date." });
      }
    } else {
      return res.status(400).json({ message: "Please select a valid leave type." });
    }

    let finalSickDays = null;
    let finalAbsenceDays = null;
    let finalMaternityDays = null;

    if (normalizedType === 'sick') {
      const s = new Date(leaveStartDate);
      const e = new Date(leaveEndDate);
      const sOnly = new Date(s.getFullYear(), s.getMonth(), s.getDate());
      const eOnly = new Date(e.getFullYear(), e.getMonth(), e.getDate());
      finalSickDays = Math.round((eOnly - sOnly) / (1000 * 60 * 60 * 24)) + 1;
    } else if (normalizedType === 'absent') {
      const s = new Date(AbsenceLeaveStartDate);
      const e = new Date(AbsenceLeaveEndDate);
      const sOnly = new Date(s.getFullYear(), s.getMonth(), s.getDate());
      const eOnly = new Date(e.getFullYear(), e.getMonth(), e.getDate());
      finalAbsenceDays = Math.round((eOnly - sOnly) / (1000 * 60 * 60 * 24)) + 1;
    } else if (normalizedType === 'maternity') {
      const s = new Date(maternityLeaveStartDate);
      const e = new Date(maternityLeaveEndDate);
      const sOnly = new Date(s.getFullYear(), s.getMonth(), s.getDate());
      const eOnly = new Date(e.getFullYear(), e.getMonth(), e.getDate());
      finalMaternityDays = Math.round((eOnly - sOnly) / (1000 * 60 * 60 * 24)) + 1;
    }

    try {
      const employee = await newEmployee.findById(employeeId).select("name");
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      const AbsenceLeave = await AbsenceLeaveModule.create({
        employeeId,
        date,
        leaveType,
        leaveStartDate: normalizedType === 'sick' ? leaveStartDate : null,
        leaveEndDate: normalizedType === 'sick' ? leaveEndDate : null,
        totalSickLeaveDays: normalizedType === 'sick' ? (totalSickLeaveDays || finalSickDays) : null,
        AbsenceLeaveStartDate: normalizedType === 'absent' ? AbsenceLeaveStartDate : null,
        AbsenceLeaveEndDate: normalizedType === 'absent' ? AbsenceLeaveEndDate : null,
        totalAbsenceLeaveDays: normalizedType === 'absent' ? (totalAbsenceLeaveDays || finalAbsenceDays) : null,
        maternityLeaveStartDate: normalizedType === 'maternity' ? maternityLeaveStartDate : null,
        maternityLeaveEndDate: normalizedType === 'maternity' ? maternityLeaveEndDate : null,
        totalMaternityLeaveDays: normalizedType === 'maternity' ? (totalMaternityLeaveDays || finalMaternityDays) : null,
        comment
      });

      res.status(201).json({
        message: `Leave successfully added for ${employee.name}`,
        AbsenceLeave
      });
    } catch (error) {
      next(error); // Pass the error to the middleware
    }
  },

  async updateAbsenceLeave(req, res, next) {
    // console.log(req.body)
    const AbsenceLeaveSchema = Joi.object({
      employeeId: Joi.objectId().required(), // ObjectId format
      date: Joi.date().required(),
      leaveType: Joi.string().required(),
      leaveStartDate: Joi.date().allow(null, ''),
      leaveEndDate: Joi.date().allow(null, ''),
      totalSickLeaveDays: Joi.number().allow(null, ''),
      AbsenceLeaveStartDate: Joi.date().allow(null, ''),
      AbsenceLeaveEndDate: Joi.date().allow(null, ''),
      totalAbsenceLeaveDays: Joi.number().allow(null, ''),
      maternityLeaveStartDate: Joi.date().allow(null, ''),
      maternityLeaveEndDate: Joi.date().allow(null, ''),
      totalMaternityLeaveDays: Joi.number().allow(null, ''),
      comment: Joi.string().allow(null, '')
    })

    const { error } = AbsenceLeaveSchema.validate(req.body); // ✅ Fix: Destructure `error`

    if (error) {
      return res.status(400).json({ message: error.details[0].message }); // ✅ Return proper error response
    }

    const {
      employeeId,
      date,
      leaveType,
      leaveStartDate,
      leaveEndDate,
      totalSickLeaveDays,
      AbsenceLeaveStartDate,
      AbsenceLeaveEndDate,
      totalAbsenceLeaveDays,
      maternityLeaveStartDate,
      maternityLeaveEndDate,
      totalMaternityLeaveDays,
      comment
    } = req.body;

    const normalizedType = leaveType ? leaveType.trim().toLowerCase() : '';

    if (normalizedType === 'sick') {
      if (!leaveStartDate) {
        return res.status(400).json({ message: "Leave Start Date is required." });
      }
      if (!leaveEndDate) {
        return res.status(400).json({ message: "Leave End Date is required." });
      }
      const start = new Date(leaveStartDate);
      const end = new Date(leaveEndDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid Leave Start Date." });
      }
      if (isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid Leave End Date." });
      }
      const sOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const eOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      if (eOnly < sOnly) {
        return res.status(400).json({ message: "End Date must never be earlier than Start Date." });
      }
    } else if (normalizedType === 'absent') {
      if (!AbsenceLeaveStartDate) {
        return res.status(400).json({ message: "Leave Absent Start Date is required." });
      }
      if (!AbsenceLeaveEndDate) {
        return res.status(400).json({ message: "Leave Absent End Date is required." });
      }
      const start = new Date(AbsenceLeaveStartDate);
      const end = new Date(AbsenceLeaveEndDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid Leave Absent Start Date." });
      }
      if (isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid Leave Absent End Date." });
      }
      const sOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const eOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      if (eOnly < sOnly) {
        return res.status(400).json({ message: "End Date must never be earlier than Start Date." });
      }
    } else if (normalizedType === 'maternity') {
      if (!maternityLeaveStartDate) {
        return res.status(400).json({ message: "Leave Maternity Start Date is required." });
      }
      if (!maternityLeaveEndDate) {
        return res.status(400).json({ message: "Leave Maternity End Date is required." });
      }
      const start = new Date(maternityLeaveStartDate);
      const end = new Date(maternityLeaveEndDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid Leave Maternity Start Date." });
      }
      if (isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid Leave Maternity End Date." });
      }
      const sOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const eOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      if (eOnly < sOnly) {
        return res.status(400).json({ message: "End Date must never be earlier than Start Date." });
      }
    } else {
      return res.status(400).json({ message: "Please select a valid leave type." });
    }

    let finalSickDays = null;
    let finalAbsenceDays = null;
    let finalMaternityDays = null;

    if (normalizedType === 'sick') {
      const s = new Date(leaveStartDate);
      const e = new Date(leaveEndDate);
      const sOnly = new Date(s.getFullYear(), s.getMonth(), s.getDate());
      const eOnly = new Date(e.getFullYear(), e.getMonth(), e.getDate());
      finalSickDays = Math.round((eOnly - sOnly) / (1000 * 60 * 60 * 24)) + 1;
    } else if (normalizedType === 'absent') {
      const s = new Date(AbsenceLeaveStartDate);
      const e = new Date(AbsenceLeaveEndDate);
      const sOnly = new Date(s.getFullYear(), s.getMonth(), s.getDate());
      const eOnly = new Date(e.getFullYear(), e.getMonth(), e.getDate());
      finalAbsenceDays = Math.round((eOnly - sOnly) / (1000 * 60 * 60 * 24)) + 1;
    } else if (normalizedType === 'maternity') {
      const s = new Date(maternityLeaveStartDate);
      const e = new Date(maternityLeaveEndDate);
      const sOnly = new Date(s.getFullYear(), s.getMonth(), s.getDate());
      const eOnly = new Date(e.getFullYear(), e.getMonth(), e.getDate());
      finalMaternityDays = Math.round((eOnly - sOnly) / (1000 * 60 * 60 * 24)) + 1;
    }

    try {
      const updateAbsence = await AbsenceLeaveModule.findOneAndUpdate(
        { _id: req.params.id },
        {
          employeeId,
          date,
          leaveType,
          leaveStartDate: normalizedType === 'sick' ? leaveStartDate : null,
          leaveEndDate: normalizedType === 'sick' ? leaveEndDate : null,
          totalSickLeaveDays: normalizedType === 'sick' ? (totalSickLeaveDays || finalSickDays) : null,
          AbsenceLeaveStartDate: normalizedType === 'absent' ? AbsenceLeaveStartDate : null,
          AbsenceLeaveEndDate: normalizedType === 'absent' ? AbsenceLeaveEndDate : null,
          totalAbsenceLeaveDays: normalizedType === 'absent' ? (totalAbsenceLeaveDays || finalAbsenceDays) : null,
          maternityLeaveStartDate: normalizedType === 'maternity' ? maternityLeaveStartDate : null,
          maternityLeaveEndDate: normalizedType === 'maternity' ? maternityLeaveEndDate : null,
          totalMaternityLeaveDays: normalizedType === 'maternity' ? (totalMaternityLeaveDays || finalMaternityDays) : null,
          comment
        },
        { new: true }
      );

      if (!updateAbsence) {
        return res.json({ message: "Leave record not found" }); // ✅ Handle missing record
      }
      res.status(201).json({ message: "update successfully", updateAbsence })
    } catch (error) {
      console.log(error)
      return next(error);
    }
  },
  async deleteAbsence(req, res, next) {
    try {
      let deleteAbsence = await AbsenceLeaveModule.findOneAndRemove({
        _id: req.params.id,
      });
      if (!deleteAbsence) {
        return next(Error("NOting to delete."))
      }
      res.json({ message: "Delete successfully", deleteAbsence })
    } catch (error) {
      return next(error)

    }
  },


  async AllAbsenceLeave(req, res, next) {

    try {
      let allAbsence = await AbsenceLeaveModule.find({})
      res.json({ allAbsence })
    } catch (error) {
      return next(error)

    }
  },

  async getEmployeeAbsenceLeave(req, res, next) {
    const employeeId = req.params.id;
    try {
      const employee = await newEmployee.findById(employeeId);

      const absenceLeaves = await AbsenceLeaveModule.find({ employeeId })
        .populate("employeeId")
        .sort({ _id: -1 });

      const ExitofLeave = require("../../model/Forms/exitofLeave");
      const exitLeaves = await ExitofLeave.find({ employeeId })
        .populate("employeeId")
        .sort({ _id: -1 });

      const combined = [];

      absenceLeaves.forEach(item => {
        combined.push(item.toObject ? item.toObject() : item);
      });

      exitLeaves.forEach(item => {
        combined.push(item.toObject ? item.toObject() : item);
      });

      combined.sort((a, b) => new Date(b.date || b.leaveStartDate || b.createdAt || 0) - new Date(a.date || a.leaveStartDate || a.createdAt || 0));

      return res.status(200).json({
        success: true,
        message: `Absence leave for employee ID: ${employeeId}`,
        employeeDetails: employee,
        getEmployeeAbsence: combined
      });
    } catch (error) {
      console.error("❌ Error in getEmployeeAbsenceLeave:", error);
      return next(error);
    }
  },




  async getTotalSickLeave(req, res, next) {
    const employeeId = req.params.id;
    try {
      const now = new Date();
      const year = now.getFullYear();
      // Calendar year range: Jan 1 to Dec 31
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year + 1, 0, 1);

      let totalSickLeave = 0;
      let totalAbsenceLeave = 0;
      let totalMaternityLeaveDays = 0;

      // Use the correct date field for filtering (likely 'date' not 'startDate')
      const employeeLeaves = await AbsenceLeaveModule.find({
        employeeId,
        date: { $gte: startDate, $lt: endDate },
      })
        .populate('employeeId')
        .sort({ createdAt: -1 });

      employeeLeaves.forEach(record => {
        const type = (record.leaveType || '').toLowerCase();
        if (type === 'sick') {
          totalSickLeave += record.totalSickLeaveDays || 0;
        }
        if (type === 'absent') {
          totalAbsenceLeave += record.totalAbsenceLeaveDays || 0;
        }
        if (type === 'maternity') {
          totalMaternityLeaveDays += record.totalMaternityLeaveDays || 0;
        }
      });

      res.json({
        employeeId,
        year,
        totalSickLeave,
        totalAbsenceLeave,
        totalMaternityLeaveDays,
        yearStartDate: startDate,
        yearEndDate: new Date(endDate.getTime() - 1),
        allLeaveRecords: employeeLeaves
      });
    } catch (error) {
      console.error("Error in getTotalSickLeave:", error);
      return next(error);
    }
  },

  async getSickLeaveByDate(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Please provide both StartDate and endDate in the query parameters.",
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const absenceLeaves = await AbsenceLeaveModule.find({
        $or: [
          { date: { $gte: start, $lte: end } },
          { leaveStartDate: { $gte: start, $lte: end } },
          { AbsenceLeaveStartDate: { $gte: start, $lte: end } },
          { maternityLeaveStartDate: { $gte: start, $lte: end } },
          { createdAt: { $gte: start, $lte: end } }
        ]
      }).populate("employeeId");

      const ExitofLeave = require("../../model/Forms/exitofLeave");
      const exitLeaves = await ExitofLeave.find({
        $or: [
          { date: { $gte: start, $lte: end } },
          { leaveStartDate: { $gte: start, $lte: end } },
          { createdAt: { $gte: start, $lte: end } }
        ]
      }).populate("employeeId");

      const employeeMap = {};

      const calcDays = (startDateVal, endDateVal) => {
        if (!startDateVal || !endDateVal) return 0;
        const s = new Date(startDateVal);
        const e = new Date(endDateVal);
        const diffTime = e - s;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays > 0 ? diffDays : 0;
      };

      const addLeaveToMap = (employee, leaveType, daysCount) => {
        if (!employee || !employee._id) return;
        if (employee.status && !["Active", "Rejoin"].includes(employee.status)) return;

        const empId = employee._id.toString();
        if (!employeeMap[empId]) {
          const employeeDoc = new newEmployee(employee.toObject ? employee.toObject() : employee);
          const empDetails = employeeDoc.toJSON({ getters: true });

          employeeMap[empId] = {
            _id: empId,
            employeeId: empDetails,
            employeeDetails: empDetails,
            annualLeave: 0,
            sickLeave: 0,
            casualLeave: 0,
            absent: 0,
            maternityLeave: 0,
            businessLeave: 0,
            emergencyLeave: 0,
            totalLeaveDays: 0
          };
        }

        const type = (leaveType || "").toLowerCase().trim();
        const count = Number(daysCount) || 0;

        if (type.includes("annual")) {
          employeeMap[empId].annualLeave += count;
        } else if (type.includes("sick")) {
          employeeMap[empId].sickLeave += count;
        } else if (type.includes("casual")) {
          employeeMap[empId].casualLeave += count;
        } else if (type.includes("absent")) {
          employeeMap[empId].absent += count;
        } else if (type.includes("maternity")) {
          employeeMap[empId].maternityLeave += count;
        } else if (type.includes("business")) {
          employeeMap[empId].businessLeave += count;
        } else if (type.includes("emergency")) {
          employeeMap[empId].emergencyLeave += count;
        }

        employeeMap[empId].totalLeaveDays =
          employeeMap[empId].annualLeave +
          employeeMap[empId].sickLeave +
          employeeMap[empId].casualLeave +
          employeeMap[empId].absent +
          employeeMap[empId].maternityLeave +
          employeeMap[empId].businessLeave +
          employeeMap[empId].emergencyLeave;
      };

      absenceLeaves.forEach((record) => {
        if (!record.employeeId) return;
        const type = (record.leaveType || "").toLowerCase().trim();
        let days = 0;
        if (type === "sick") {
          days = record.totalSickLeaveDays || calcDays(record.leaveStartDate, record.leaveEndDate);
        } else if (type === "absent") {
          days = record.totalAbsenceLeaveDays || calcDays(record.AbsenceLeaveStartDate, record.AbsenceLeaveEndDate);
        } else if (type === "maternity") {
          days = record.totalMaternityLeaveDays || calcDays(record.maternityLeaveStartDate, record.maternityLeaveEndDate);
        } else {
          days = record.numberOfDayLeave || calcDays(record.leaveStartDate, record.leaveEndDate);
        }
        addLeaveToMap(record.employeeId, record.leaveType, days);
      });

      exitLeaves.forEach((record) => {
        if (!record.employeeId) return;
        const days = record.numberOfDayLeave || calcDays(record.leaveStartDate, record.leaveEndDate);
        addLeaveToMap(record.employeeId, record.leaveType, days);
      });

      const summaryData = Object.values(employeeMap);

      return res.status(200).json({
        success: true,
        message: 'Leaves fetched successfully.',
        data: summaryData,
      });

    } catch (error) {
      console.error('❌ Error:', error);
      return next(error);
    }
  },

  async getEmployeeLatestAbsenceLeave(req, res, next) {
    try {
      const selectedYear = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
      const startOfYear = new Date(selectedYear, 0, 1);
      const endOfYear = new Date(selectedYear, 11, 31, 23, 59, 59, 999);

      const absenceLeaves = await AbsenceLeaveModule.find({
        $or: [
          { date: { $gte: startOfYear, $lte: endOfYear } },
          { leaveStartDate: { $gte: startOfYear, $lte: endOfYear } },
          { AbsenceLeaveStartDate: { $gte: startOfYear, $lte: endOfYear } },
          { maternityLeaveStartDate: { $gte: startOfYear, $lte: endOfYear } },
          { createdAt: { $gte: startOfYear, $lte: endOfYear } }
        ]
      }).populate("employeeId");

      const ExitofLeave = require("../../model/Forms/exitofLeave");
      const exitLeaves = await ExitofLeave.find({
        $or: [
          { date: { $gte: startOfYear, $lte: endOfYear } },
          { leaveStartDate: { $gte: startOfYear, $lte: endOfYear } },
          { createdAt: { $gte: startOfYear, $lte: endOfYear } }
        ]
      }).populate("employeeId");

      const employeeMap = {};

      const calcDays = (startDateVal, endDateVal) => {
        if (!startDateVal || !endDateVal) return 0;
        const s = new Date(startDateVal);
        const e = new Date(endDateVal);
        const diffTime = e - s;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays > 0 ? diffDays : 0;
      };

      const addLeaveToMap = (employee, leaveType, daysCount) => {
        if (!employee || !employee._id) return;
        if (employee.status && !["Active", "Rejoin"].includes(employee.status)) return;

        const empId = employee._id.toString();
        if (!employeeMap[empId]) {
          const employeeDoc = new newEmployee(employee.toObject ? employee.toObject() : employee);
          const empDetails = employeeDoc.toJSON({ getters: true });

          employeeMap[empId] = {
            _id: empId,
            employeeId: empDetails,
            employeeDetails: empDetails,
            annualLeave: 0,
            sickLeave: 0,
            casualLeave: 0,
            absent: 0,
            maternityLeave: 0,
            businessLeave: 0,
            emergencyLeave: 0,
            totalLeaveDays: 0
          };
        }

        const type = (leaveType || "").toLowerCase().trim();
        const count = Number(daysCount) || 0;

        if (type.includes("annual")) {
          employeeMap[empId].annualLeave += count;
        } else if (type.includes("sick")) {
          employeeMap[empId].sickLeave += count;
        } else if (type.includes("casual")) {
          employeeMap[empId].casualLeave += count;
        } else if (type.includes("absent")) {
          employeeMap[empId].absent += count;
        } else if (type.includes("maternity")) {
          employeeMap[empId].maternityLeave += count;
        } else if (type.includes("business")) {
          employeeMap[empId].businessLeave += count;
        } else if (type.includes("emergency")) {
          employeeMap[empId].emergencyLeave += count;
        }

        employeeMap[empId].totalLeaveDays =
          employeeMap[empId].annualLeave +
          employeeMap[empId].sickLeave +
          employeeMap[empId].casualLeave +
          employeeMap[empId].absent +
          employeeMap[empId].maternityLeave +
          employeeMap[empId].businessLeave +
          employeeMap[empId].emergencyLeave;
      };

      absenceLeaves.forEach((record) => {
        if (!record.employeeId) return;
        const type = (record.leaveType || "").toLowerCase().trim();
        let days = 0;
        if (type === "sick") {
          days = record.totalSickLeaveDays || calcDays(record.leaveStartDate, record.leaveEndDate);
        } else if (type === "absent") {
          days = record.totalAbsenceLeaveDays || calcDays(record.AbsenceLeaveStartDate, record.AbsenceLeaveEndDate);
        } else if (type === "maternity") {
          days = record.totalMaternityLeaveDays || calcDays(record.maternityLeaveStartDate, record.maternityLeaveEndDate);
        } else {
          days = record.numberOfDayLeave || calcDays(record.leaveStartDate, record.leaveEndDate);
        }
        addLeaveToMap(record.employeeId, record.leaveType, days);
      });

      exitLeaves.forEach((record) => {
        if (!record.employeeId) return;
        const days = record.numberOfDayLeave || calcDays(record.leaveStartDate, record.leaveEndDate);
        addLeaveToMap(record.employeeId, record.leaveType, days);
      });

      const lastAbsenceLeave = Object.values(employeeMap);

      return res.status(200).json({
        success: true,
        lastAbsenceLeave: lastAbsenceLeave,
      });
    } catch (error) {
      console.error("❌ Error:", error);
      return next(error);
    }
  }

}

module.exports = AbsenceLeaveController