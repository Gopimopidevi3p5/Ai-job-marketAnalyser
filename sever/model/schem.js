import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  excelSheetData: Array,
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
