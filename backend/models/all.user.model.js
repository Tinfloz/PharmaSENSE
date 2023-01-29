import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const allUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'A password is required'],
    },
    name: {
        type: String
    },
    userType: {
        type: String,
        enum: ["Patient", "Chemist"],
        required: true
    },
    resetToken: {
        type: String
    },
    resetTokenExpires: {
        type: String,
    }
}, { timestamps: true })

// pre save
allUserSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return next()
    };
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// method 
allUserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
};

const Users = mongoose.model("Users", allUserSchema);

export default Users;