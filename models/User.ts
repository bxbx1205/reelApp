import mongoose, { Schema,model,models } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "user" | "admin";

export interface Iuser {
    email: string;
    password?: string;
    role: UserRole;
    image?: string;
    name?: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Admin email - god mode
export const ADMIN_EMAILS = ["srbhanarkar05@gmail.com"];

const userSchema = new Schema<Iuser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false }, // Optional for OAuth users
        role: { type: String, enum: ["user", "admin"], default: "user" },
        image: { type: String },
        name: { type: String },
    },

    {
        timestamps: true,

    }
);

userSchema.pre("save", async function () {
    // Set admin role for admin emails
    if (ADMIN_EMAILS.includes(this.email)) {
        this.role = "admin";
    }
    
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

const User =models?.User || model<Iuser>("User", userSchema)

export default User;