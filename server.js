const express = require("express");
const multer = require("multer");
const fluentFfmpeg = require("fluent-ffmpeg");
const acoustid = require("acoustid");

const app = express();
const port = 3000;

// Set the path to ffmpeg
fluentFfmpeg.setFfmpegPath("path/usr/local/bin/ffmpeg");

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static("public"));

app.post("/identify", upload.single("audioFile"), async (req, res) => {
  try {
    const audioBuffer = req.file.buffer;
    const fingerprintData = await acoustid.fingerprint({
      key: "b'WixO9taV",
      file: audioBuffer,
    });

    const { fingerprint, duration } = fingerprintData[0];

    const results = await acoustid.lookup({
      key: "b'WixO9taV",
      fingerprint,
      duration,
    });

    const formattedResults = results.map((result) => ({
      score: result.score,
      trackId: result.id,
      title: result.title,
      artist: result.artist,
    }));

    res.json({
      success: true,
      message: "Identification successful",
      results: formattedResults,
    });
  } catch (error) {
    console.error("Error:", error);
    res.json({
      success: false,
      error: "Identification failed",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
