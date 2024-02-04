const ffmpeg = require("fluent-ffmpeg");
const acoustid = require("acoustid");

ffmpeg.setFfmpegPath("path/usr/local/bin/ffmpeg");

async function generateFingerprint(apiKey, audioFilePath) {
  try {
    const audio = await ffmpeg().input(audioFilePath).toBuffer();
    const fingerprintData = await acoustid.fingerprint({
      key: apiKey,
      file: audio,
    });

    const { fingerprint, duration } = fingerprintData[0];
    return [fingerprint, duration];
  } catch (error) {
    console.error(`Error in generateFingerprint: ${error}`);
    return [null, null];
  }
}

async function identifyMusic(apiKey, fingerprint, duration) {
  try {
    const results = await acoustid.lookup({
      key: apiKey,
      fingerprint,
      duration,
    });

    results.forEach((result) => {
      console.log(
        `Score: ${result.score}, Track ID: ${result.id}, Title: ${result.title}, Artist: ${result.artist}`
      );
    });
  } catch (error) {
    console.error(`Error in identifyMusic: ${error}`);
  }
}

const apiKey = "b'WixO9taV";
const audioFilePath = "path/usr/ryanfields/repos/week4/poetic-justice.mp3";

async function main() {
  const [fingerprint, duration] = await generateFingerprint(
    apiKey,
    audioFilePath
  );
  console.log(`Fingerprint: ${fingerprint}, Duration: ${duration}`);

  if (fingerprint && duration) {
    await identifyMusic(apiKey, fingerprint, duration);
  }
}

main();
