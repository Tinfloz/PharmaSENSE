import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.middleware.js";
import userRouter from "./routes/all.user.routes.js";
import chemistRouter from "./routes/chemist.routes.js";
import deliveryRouter from "./routes/delivery.routes.js";
import patientRouter from "./routes/patient.routes.js";
import storeRouter from "./routes/store.routes.js"
import drugRouter from "./routes/drugs.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 9000;

// middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json());

// mongo connect
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => console.log("connected to mongo db")).catch(err => console.log(err));

// test route
app.get("/", (req, res) => {
    res.status(200).send({ success: true, message: "connected to server" })
});

app.use("/api/user", userRouter);
app.use("/api/chemist", chemistRouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/patient", patientRouter);
app.use("/api/store", storeRouter);
app.use("/api/drug", drugRouter);

app.use(errorHandler)
app.listen(port, () => console.log(`listening on port: ${port}`));