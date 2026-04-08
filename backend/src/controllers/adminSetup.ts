import { Request, Response } from 'express';
import { User } from '../models/User';
import { sendEmail } from '../config/email';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Common Logic to Setup Admin
 * Checks if any admin exists, if not creates one.
 */
export const setupAdminLogic = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) return { success: true, message: 'Admin already exists' };

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment');
      return { success: false, message: 'Missing credentials in environment' };
    }

    const admin = new User({
      name: 'Super Admin',
      email,
      password,
      role: 'admin',
      status: 'Active',
    });

    await admin.save();

    const emailHtml = `
      <div style="font-family: inherit; padding: 20px; border-radius: 10px; background: #eef2ff;">
        <h2 style="color: #4f46e5;">Admin Account Created Successfully</h2>
        <p>Your CRM Admin account has been set up with the following credentials:</p>
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        <p style="color: #ef4444; font-weight: bold;">Important: Please change your password on first login for security.</p>
        <p>Best regards,<br/>The Development Team</p>
      </div>
    `;

    await sendEmail(email, 'CRM Admin Account Created', emailHtml);
    return { success: true, message: 'Admin created and credentials sent' };
  } catch (error: any) {
    console.error('Admin Setup Logic Error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * @route POST /api/admin/setup
 * @desc API Route to trigger admin setup
 */
export const apiSetupAdmin = async (_req: Request, res: Response): Promise<void> => {
  const result = await setupAdminLogic();
  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(500).json({ message: result.message });
  }
};
