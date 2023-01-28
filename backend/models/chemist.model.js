import mongoose from "mongoose";

const chemistSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    stores: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Stores"
        }
    ]
}, { timestamps: true });

const Chemists = mongoose.model("Chemists", chemistSchema);

export default Chemists;