import mongoose from "mongoose";
import Deliveries from "./deliveries.model.js";
import { setDaysTimeout } from "../utils/set.days.timeout.js";
import lt from "long-timeout";

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


// post hook
drugSchema.post("save", function () {
    lt.setTimeout(async () => {
        await this.populate({
            path: "patient",
            select: "userId _id location",
            populate: {
                path: "userId",
                select: "_id email"
            }
        })
        await Deliveries.create({
            patient: this.patient._id,
            location: {
                type: "Point",
                coordinates: [this.patient.location.coordinates[0], this.patient.location.coordinates[1]]
            },
            drug: this._id,
        })
    }, (this.uptoCriticalLevelDays * 86400000))
});

const Drugs = mongoose.model("Drugs", drugSchema);

export default Drugs;