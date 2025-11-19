import mongoose, { Document, Schema } from "mongoose";

export interface IUSER extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUSER>({
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [6, 'Passowrd must be at least 6 characters'],
            select: false,
        },
    },
    {
        timestamps: true
    },
)

//Hash password before saving
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next();
    }

    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model<IUSER>('User', userSchema);

export default User;