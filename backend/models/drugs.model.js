import mongoose from "mongoose";
import Deliveries from "./deliveries.model.js";

const drugSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Types.ObjectId,
        ref: "Patients"
    },
    drug: {
        type: String,
        required: true
    },
    dosage: {
        type: Number,
        required: true
    },
    remaining: {
        type: Number,
        required: true
    },
    volume: {
        type: Number,
        required: true
    },
    slots: [
        {
            type: String,
            required: true
        }
    ],
    critical: {
        type: Number,
        required: true
    },
    uptoCriticalLevelDays: {
        type: Number,
        required: true
    },
}, { timestamps: true });

// pre hook
drugSchema.pre("save", function () {
    this.populate({
        path: "patient",
        select: "userId _id latitude longitude",
        populate: {
            path: "userId",
            select: "_id email"
        }
    });
    return next();
})

// post hook
drugSchema.post("save", function () {
    setTimeout(async () => {
        await Deliveries.create({
            patient: this.patient._id,
            location: {
                type: "Point",
                coordinates: [this.patient.longitude, this.patient.latitude]
            },
            drug: this._id,
        })
    }, (this.uptoCriticalLevelDays * 86400000))
});

const Drugs = mongoose.model("Drugs", drugSchema);

export default Drugs;