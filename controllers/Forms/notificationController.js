const cron = require('node-cron');
const newEmployee = require('../../model/Forms/newEmployee');
const Notification = require('../../model/notification/NotificationModule');
const moment = require('moment'); 
const notificationController = {
     /** 
     * 🔔 Qatar ID Expiry Notification via Cron Job
     */ 
     async setUpExpiryNotifications(io) {  
        cron.schedule('* * * * *', async () => { // Schedule the task to run every day at 6:00 AM
              try { 
                console.log('🔄 Checking for Qatar ID Expiry Notifications...'); 
                const currentDate = moment().startOf('day'); // Current date at midnight
                const tomorrowDate = moment(currentDate).add(1, 'days'); // Tomorrow
                const twoMonthsLater = moment(currentDate).add(2, 'months'); // Two months later

                // Fetch employees whose Qatar ID expires within the next 2 months
                const employees = await newEmployee.find({
                    status: "Active",
                    $or: [
                        { qatarIdExpiry: { $lte: twoMonthsLater.toDate(), $gte: currentDate.toDate() } },
                        { passportDateOfExpiry: { $lte: twoMonthsLater.toDate(), $gte: currentDate.toDate() } },
                        { probationDate: { $lte: tomorrowDate.toDate(), $gte: currentDate.toDate() } },
                    ]
                }); 

                for (const employee of employees) {
                    // Qatar ID Expiry Notification (2 Months Before Expiry)
                    if (employee.qatarIdExpiry && moment(employee.qatarIdExpiry).isBetween(currentDate, twoMonthsLater, 'days', '[]')) {
                        let qatarNotificationMessage = `🔔 Reminder: ${employee.name}'s Qatar ID will expire on ${moment(employee.qatarIdExpiry).format('DD/MM/YYYY')}.`;
                        await this.sendExpiryNotification(io, employee, qatarNotificationMessage);
                    }

                    // Passport Expiry Notification
                    if (employee.passportDateOfExpiry && moment(employee.passportDateOfExpiry).isBetween(currentDate, twoMonthsLater, 'days', '[]')) {
                        let passportNotificationMessage = `🔔 Reminder: ${employee.name}'s Passport will expire on ${moment(employee.passportDateOfExpiry).format('DD/MM/YYYY')}.`;
                        await this.sendExpiryNotification(io, employee, passportNotificationMessage);
                    }

                    // Probation Date Notification
                    if (employee.probationDate && moment(employee.probationDate).isBetween(currentDate, tomorrowDate, 'days', '[]')) {
                        let probationNotificationMessage = `🔔 Reminder: ${employee.name}'s probation period is ending on ${moment(employee.probationDate).format('DD/MM/YYYY')}.`;
                        await this.sendExpiryNotification(io, employee, probationNotificationMessage);
                    }
                }

                console.log(`✅ Processed ${employees.length} employee notifications.`);
            } catch (error) {
                console.error('❌ Error in Expiry Notification Job:', error);
            }
        });
    },

    
// ✅ Helper Function to Send Notification
async sendExpiryNotification(io, employee, message) {
    // Check if notification already exists to prevent duplicates
    const existingNotification = await Notification.findOne({
        employeeId: employee._id,
        message: message,
    });

    if (!existingNotification) {
        const notification = new Notification({
            employeeId: employee._id,
            message: message,
        });
        await notification.save();

        // Emit the notification through WebSocket
        io.emit("expiryNotification", {
            message: notification.message,
            employeeId: employee,
            timestamp: notification.timestamp
        });

        console.log(`✅ Notification sent and saved for ${employee.name}`);
    }
},
  
    /** 
     * 📥 Fetch All Notifications
     */
    async getNotification(req, res) {
        try {
            const notifications = await Notification.find()
            .sort({ timestamp: -1 })
            .populate('employeeId'); // Populates all fields of the Employee model
            res.json(notifications);
        } catch (error) {
            console.error('❌ Error fetching notifications:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    async markAsRead (req,res,next){
     
        try {
            const notificationId = req.params.id;
            const {read} = req.body;
            
            const updatedNotification = await Notification.findByIdAndUpdate(
                notificationId,
                {read:read},
                {new:true}
            );

            if(!updatedNotification){
                return res.status(404).json({error:"Notification not found"})
            }
         
            res.json(updatedNotification);
        } catch (error) {
            console.error('❌ Error updating notification:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
};
 
module.exports = notificationController;
