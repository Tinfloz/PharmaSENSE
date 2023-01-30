import Patients from "../models/patient.model.js";
import Drugs from "../models/drugs.model.js";
import Users from "../models/all.user.model.js";
import mongoose from "mongoose";
import { getCriticalLevel } from "../utils/get.critical.js";

// create drugs 
const createMedications = async (req, res) => {
    try {
        const { name, dosage, volume, slots } = req.body;
        if (!name || !dosage || !volume || !slots) {
            throw "fields missing";
        };
        const patient = await Patients.findOne({ userId: req.user._id });
        const drug = await Drugs.create({
            patient: patient._id,
            name,
            dosage,
            volume,
            slots,
            critical: getCriticalLevel(volume),
            remaining: volume
        });
        if (!drug) {
            throw "could not be created";
        };
        patient.drugs.push(drug._id);
        await patient.save();
        res.status(200).json({
            success: true,
            drug
        });
        return
    } catch (error) {
        if (error === "fields missing") {
            res.status(400).json({
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
        await drug.save();
        res.status(400).json({
            success: true,
            id,
            dosage
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
export {
    createMedications,
    deleteMedication,
    changeDosage
}