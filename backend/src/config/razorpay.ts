import Razorpay from 'razorpay';
import dotenv from 'dotenv';

import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  console.warn('⚠️  RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in .env. Payment features will fail.');
} else {
  console.log('✅ Razorpay configuration loaded: Key ID present, Secret present (masked)');
}

export const razorpayInstance = new Razorpay({
  key_id: key_id || '',
  key_secret: key_secret || '',
});

