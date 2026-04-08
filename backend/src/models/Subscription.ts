import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  planName: string;
  planPrice: number;
  planFeatures: string[];
  paymentId: string;
  orderId: string;
  paymentStatus: 'pending' | 'success' | 'failed';
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  createdAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planName: { type: String, required: true },
    planPrice: { type: Number, required: true },
    planFeatures: { type: [String], default: [] },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'success', 'failed'], 
      default: 'pending' 
    },
    subscriptionStartDate: { type: Date, required: true },
    subscriptionEndDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
