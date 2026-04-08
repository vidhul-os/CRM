import { Request, Response } from 'express';
import crypto from 'crypto';
import { razorpayInstance } from '../config/razorpay';
import { User } from '../models/User';
import { Subscription } from '../models/Subscription';
import { sendEmail } from '../config/email';

/**
 * @route POST /api/payment/create-order
 * @desc Create a Razorpay order
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, planName } = req.body;

    if (!amount || !planName) {
      res.status(400).json({ success: false, message: 'Amount and plan name are required' });
      return;
    }

    // Razorpay amount is in paise (₹1 = 100 paise)
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { planName },
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order', error: error.message });
  }
};

/**
 * @route POST /api/payment/verify
 * @desc Verify Razorpay signature and activate subscription
 */
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userDetails,
      planDetails
    } = req.body;

    // Verify signature using crypto
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
      return;
    }

    // Find or create user
    let user = await User.findOne({ email: userDetails.email });
    if (!user) {
      user = new User({
        ...userDetails,
        role: 'Admin',
        status: 'Active',
      });
    } else {
      // Update existing user details if provided and set as admin
      Object.assign(user, userDetails);
      user.role = 'Admin';
    }
    
    // Initial save to get _id if new
    await user.save();

    // Ensure adminId is set (for an Admin, adminId is their own _id)
    if (!user.adminId) {
      user.adminId = user._id;
      await user.save();
    }

    // Create Subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);

    const subscription = new Subscription({
      userId: user._id,
      planName: planDetails.name,
      planPrice: planDetails.price,
      planFeatures: planDetails.features,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: 'success',
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
    });
    await subscription.save();

    // Send Confirmation Email
    const emailHtml = `
      <div style="font-family: inherit; padding: 20px; border-radius: 10px; background: #f9f9f9;">
        <h2 style="color: #4f46e5;">Welcome to NexusCRM, ${user.name}!</h2>
        <p>Your subscription to the <strong>${planDetails.name}</strong> is now active. 🎉</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4f46e5; font-size: 16px;">Login Credentials</h3>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Password:</strong> ${userDetails.password || 'As set during checkout'}</p>
          <p style="font-size: 12px; color: #666;">Use these credentials to log in to your CRM dashboard.</p>
        </div>

        <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4f46e5; font-size: 16px;">Subscription Details</h3>
          <p><strong>Amount Paid:</strong> ₹${planDetails.price}</p>
          <p><strong>Start Date:</strong> ${startDate.toLocaleDateString()}</p>
          <p><strong>End Date:</strong> ${endDate.toLocaleDateString()}</p>
          <p><strong>Subscription ID:</strong> ${subscription._id}</p>
        </div>
        
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Best regards,<br/>The NexusCRM Team</p>
      </div>
    `;

    await sendEmail(user.email, 'Your CRM Subscription is Active 🎉', emailHtml);

    res.status(200).json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscriptionId: subscription._id,
      startDate,
      endDate
    });
  } catch (error: any) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error during verification', error: error.message });
  }
};
