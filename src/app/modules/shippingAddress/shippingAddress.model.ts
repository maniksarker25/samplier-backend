import mongoose, { Schema } from 'mongoose';
import { IShippingAddress } from './shippingAddress.interface';

const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: 'Reviewer', required: true },
    name: { type: String, required: true },
    company: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    alternativePhoneNumber: { type: String, required: true },
    street1: {
      type: String,
      required: true,
    },
    street2: {
      type: String,
    },
  },
  { timestamps: true },
);

const ShippingAddress = mongoose.model<IShippingAddress>(
  'ShippingAddress',
  shippingAddressSchema,
);

export default ShippingAddress;
