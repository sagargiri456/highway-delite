import mongoose,{Schema,Document} from "mongoose";

export interface Iuser extends Document{
    name: string;
    email: string;
    dateOfBirth: Date;
    password?: string;
    isVerified: boolean;
    otp?: string;
    otpExpires?: Date;
    role?: 'user' | 'admin';
}

const UserSchema: Schema<Iuser> = new Schema(
    {
        name: { type: String, required: true, minlength: 2, maxlength: 50 },
        email: { type: String, required: true, unique: true },
        dateOfBirth: { type: Date, required: true },
        password: { type: String }, // optional for OTP-only flow
        isVerified: { type: Boolean, default: false },
        otp: { type: String },
        otpExpires: { type: Date },
        role: { type: String, enum: ['user', 'admin'], default: 'user' }
    },
    { 
        timestamps: true 
    }
    
)

export default mongoose.model<Iuser>('User', UserSchema);