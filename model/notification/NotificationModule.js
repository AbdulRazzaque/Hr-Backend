const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'NewEmployee' }, // Reference to employee
    message:{type:String,required:true},
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }, // Track if the notification is read/dismissed
});

module.exports =mongoose.model('Notification', NotificationSchema) 