// Email Notification Service (Nodemailer Simulation)

const sendEmailNotification = async ({ to, subject, body }) => {
  console.log(`📧 [EMAIL SENT TO: ${to}] | Subject: "${subject}"`);
  console.log(`   Message Body: ${body}`);
  return { success: true, timestamp: new Date().toISOString() };
};

module.exports = { sendEmailNotification };
