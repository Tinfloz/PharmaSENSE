import Patients from "../models/patient.model.js";
import Drugs from "../models/drugs.model.js";
import { getDaysUptoCriticalLevel } from "../utils/get.critical.day.js";
import nodeCron from "node-cron";

const getMyDrugs = async (req, res) => {
    try {
        const patient = await Patients.findOne({ userId: req.user._id }).populate("drugs");
        res.status(200).json({
            success: true,
            drugs: patient.drugs
        });
        return
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// delete medications 
const deleteMedication = async (req, res) => {
    try {
        const patient = await Patients.findOne({ userId: req.user._id });
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id invalid"
        };
        const drug = await Drugs.findById(id);
        if (!drug) {
            throw "drug not found";
        };
        if (drug.patient.toString() !== patient._id.toString()) {
            throw "not authorised to delete";
        };
        for (let element of patient.drugs) {
            if (element.toString() === id) {
                let index = patient.drugs.indexOf(element);
                patient.drugs.splice(index, 1);
                break;
            };
        };
        await drug.remove();
        await patient.save();
        res.status(200).json({
            success: true,
            id
        });
        return
    } catch (error) {
        if (error === "drug not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "not authorised") {
            res.status(403).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

// change dosage 
const changeDosage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id invalid"
        };
        const { dosage } = req.body;
        const drug = await Drugs.findById(id);
        if (!drug) {
            throw "drug not found";
        };
        const patient = await Patients.findOne({ userId: req.user._id });
        if (drug.patient.toString() !== patient._id.toString()) {
            throw "not authorised"
        };
        drug.dosage = dosage;
        drug.uptoCriticalLevelDays = getDaysUptoCriticalLevel(drug.volume, drug.dosage, drug.critical, drug.slots.length);
        await drug.save();
        res.status(400).json({
            success: true,
            drug
        });
        return
    } catch (error) {
        if (error === "drug not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "not authorised") {
            res.status(403).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

// cron job to change remaining level
nodeCron.schedule("0 0 * * *", async () => {
    console.log("running run cron job");
    for await (let drug of Drugs.find()) {
        let lessQty = drug.dosage * drug.slots.length;
        drug.remaining = Math.floor(drug.remaining - lessQty);
        await drug.save();
    };
});

export {
    getMyDrugs,
    deleteMedication,
    changeDosage
}