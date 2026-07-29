import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import multer from "multer";
import XLSX from "xlsx";
import mongoose from "mongoose";
import Job from "./model/schem.js";
import fs from "fs";
import Groq from "groq-sdk";
import pdfParse from "pdf-parse";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { CohereClientV2 } from "cohere-ai";
import { Mistral } from "@mistralai/mistralai";
import { prompt } from "./utilits/propt.js";

const app = express();

const uploaded = multer({
  dest: "uploads/",
});

app.use(express.json());
app.use(
  cors({origin:"https://ai-job-market-analyser-proj-git-master-ai-interview-iq.vercel.app"}))
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log(error);
  });

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

// Upload Excel upload
app.get("/", (req, res) => {
  res.json({
    message: "Job Market Analyzer API is running",
  });
});
app.post("/upload", uploaded.single("excel"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an Excel file",
      });
    }

    const fileName = req.file.path;
    const workBook = XLSX.readFile(fileName);

    const sheet = workBook.Sheets[workBook.SheetNames[0]];

    const data = XLSX.utils.sheet_to_json(sheet);

    const jobData = await Job.create({
      excelSheetData: data,
    });

    res.json({
      message: "Excel uploaded successfully",
      data: jobData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Resume Upload

app.post("/resume", uploaded.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload resume",
      });
    }

    const buffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    const jobs = (await Job.find()).flatMap((item) => item.excelSheetData);

    let response = "";

    // GROQ
    try {
      const result = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: prompt(resumeText, jobs),
      });

      response = result.choices[0].message.content;
      console.log("Groq Success");
    } catch (err) {
      console.log("Groq Failed");
    }

    // GEMINI
    if (!response) {
      try {
        const result = await gemini.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt(resumeText, jobs),
        });

        response = result.text;
        console.log("Gemini Success");
      } catch (err) {
        console.log("Gemini Failed");
      }
    }

    // OPENAI
    if (!response) {
      try {
        const result = await openai.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: prompt(resumeText, jobs),
        });

        response = result.choices[0].message.content;
        console.log("OpenAI Success");
      } catch (err) {
        console.log("OpenAI Failed");
      }
    }

    // OPENROUTER
    if (!response) {
      try {
        const result = await openrouter.chat.completions.create({
          model: "openai/gpt-4.1-mini",
          messages: prompt(resumeText, jobs),
        });

        response = result.choices[0].message.content;
        console.log("OpenRouter Success");
      } catch (err) {
        console.log("OpenRouter Failed");
      }
    }

    // COHERE
    if (!response) {
      try {
        const result = await cohere.chat({
          model: "command-r-plus",
          messages: prompt(resumeText, jobs),
        });

        response = result.message.content[0].text;
        console.log("Cohere Success");
      } catch (err) {
        console.log("Cohere Failed");
      }
    }

    // MISTRAL
    if (!response) {
      try {
        const result = await mistral.chat.complete({
          model: "mistral-large-latest",
          messages: prompt(resumeText, jobs),
        });

        response = result.choices[0].message.content;
        console.log("Mistral Success");
      } catch (err) {
        console.log("Mistral Failed");
      }
    }

    if (!response) {
      return res.status(500).json({
        message: "All AI providers failed.",
      });
    }

    // Clean AI response
    response = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log(response);

    // Parse JSON safely
    let matchedJobs;

    try {
      matchedJobs = JSON.parse(response);
    } catch (err) {
      console.log("Invalid JSON from AI");

      return res.status(500).json({
        message: "AI returned invalid JSON",
        aiResponse: response,
      });
    }

    res.status(200).json({
      message: "Matched Jobs",
      data: matchedJobs,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
  }
});

// Get all jobs

app.get("/get-data", async (req, res) => {
  try {
    const result = await Job.find();

    const jobs = result.flatMap((item) => item.excelSheetData);

    res.json({
      message: "Data fetched successfully",

      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
