const express = require('express');
const registerSchema = require('../controllers/Auth/registerController');
const LoginSchema = require('../controllers/Auth/loginController');
const userController = require('../controllers/Auth/userController');
const auth = require('../middlewares/auth');
const newEmployeeController = require('../controllers/Forms/newEmployeeController');
const endofServicesController = require('../controllers/Forms/endofServicesController');
const exitForLeaveController = require('../controllers/Forms/exitForLeaveController');
const EmployeeResumeController = require('../controllers/Forms/EmployeeResumeController');
const RprenewalformController = require('../controllers/Forms/RprenewalformController');
const AnnualsettelmentController = require('../controllers/Forms/AnnualsettelmentController');



const Route = express.Router()
//-------------------Auth Routh-----------------------------------------
Route.post('/register',registerSchema.register)
Route.post('/login',LoginSchema.login)
Route.get('/me',  auth, userController.me)

//========================== Forms=================================


//-------------------allEmployee------------------------------------
Route.get('/allEmployee/',newEmployeeController.allEmployee)
Route.get('/oneEmployee/:id',newEmployeeController.oneEmployee)
Route.post('/newEmployee', auth,newEmployeeController.newEmployee)
Route.put('/updateEmployee/:id', auth,newEmployeeController.updateEmployee)
Route.delete('/deleteEmployee/:id', auth,newEmployeeController.deleteEmployee)
Route.get('/getTotalActiveEmployees/',newEmployeeController.getTotalActiveEmployees)
//--------------------------------allEmployee--------------------------------------

//----------------------end of services-----------------------------
Route.get('/allEndofservice/',endofServicesController.allEndofservice)
Route.get('/oneEndofservice/:id',endofServicesController.oneEndofservice)
Route.post('/endofservices', auth,endofServicesController.endofservices)
Route.put('/UpdateEndofservices/:id', auth,endofServicesController.UpdateEndofservices)
Route.delete('/deleteEndofservice/:id', auth,endofServicesController.deleteEndofservice)
Route.get('/getTotalExitEmployees',endofServicesController.getTotalExitEmployees)
//-----------------------------enf of services----------------------------------------

//=========================exit for leave======================================
Route.get('/allExitofleave/',exitForLeaveController.allExitofleave)
Route.get('/oneExitofleave/:id',exitForLeaveController.oneExitofleave)
Route.post('/exitofleave', auth,exitForLeaveController.exitofleave)
Route.put('/updateExitofleave/:id', auth,exitForLeaveController.updateExitofleave)
Route.delete('/deleteExitofleave/:id', auth,exitForLeaveController.deleteExitofleave)
Route.get('/getEmployeeLeave/:employeeId', auth,exitForLeaveController.getEmployeeLeave)
Route.get('/getEmployeeByIdExitLeave/:employeeId',exitForLeaveController.getEmployeeByIdExitLeave)
Route.get('/getEmployeeLatestLeave/',exitForLeaveController.getEmployeeLatestLeave)
//=====================================================================================

//=========================Resume of work======================================
Route.get('/allEmployeeResume/',EmployeeResumeController.allEmployeeResume)
Route.get('/oneEmployeeResume/:id',EmployeeResumeController.oneEmployeeResume)
Route.post('/EmployeeResume', auth,EmployeeResumeController.EmployeeResume)
Route.put('/UpdateEmployeeResume/:id', auth,EmployeeResumeController.UpdateEmployeeResume)
Route.delete('/deleteEmployeeResume/:id', auth,EmployeeResumeController.deleteEmployeeResume)
Route.get('/getEmployeeResume/:employeeId', auth,EmployeeResumeController.getEmployeeResume)
//=====================================================================================


//=========================RP Renewal Form======================================
Route.get('/allRprenewalform/',RprenewalformController.allRprenewalform)
Route.get('/oneRprenewalform/:id',RprenewalformController.oneRprenewalform)
Route.post('/Rprenewalform', auth,RprenewalformController.Rprenewalform)
Route.put('/UpdateRprenewalform/:id', auth,RprenewalformController.UpdateRprenewalform)
Route.delete('/deleteUpdateRprenewalform/:id', auth,RprenewalformController.deleteUpdateRprenewalform)
//=====================================================================================


//=========================Annualsettelment======================================
Route.get('/allAnnualsettelment/',AnnualsettelmentController.allAnnualsettelment)
// Route.get('/oneRprenewalform/:id',AnnualsettelmentController.oneRprenewalform)
Route.post('/Annualsettelment', auth,AnnualsettelmentController.Annualsettelment)
Route.put('/UpdateAnnualsettelment/:id', auth,AnnualsettelmentController.UpdateAnnualsettelment)
Route.delete('/deleteAnnualsettelment/:id', auth,AnnualsettelmentController.deleteAnnualsettelment)
Route.get('/getEmployeeAnnualSettlements/:employeeId',AnnualsettelmentController.getEmployeeAnnualSettlements)
//=====================================================================================
module.exports = Route;
