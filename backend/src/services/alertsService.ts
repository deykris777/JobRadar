import { Alert } from "../models/Alert";
import { Job, IJob } from "../models/Job";
// import { sendEmail } from "./emailService";

export const matchAndSendAlerts = async () => {
  try {
    const activeAlerts = await Alert.find({ isActive: true });
    
    for (const alert of activeAlerts) {
      // Find jobs posted in the last 24 hours that match this alert
      const query: any = {
        isActive: true,
        postedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      };

      if (alert.roles.length > 0) query.role = { $in: alert.roles };
      if (alert.minStipend > 0) query.stipendMin = { $gte: alert.minStipend };

      const matchingJobs = await Job.find(query).limit(5);

      if (matchingJobs.length > 0) {
        console.log(`✉️ Sending alert to ${alert.email} (${matchingJobs.length} matches)`);
        // await sendEmail(alert.email, matchingJobs);
      }
    }
  } catch (error) {
    console.error("Alert matching error:", (error as Error).message);
  }
};
