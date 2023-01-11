const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const keys = require("./keys");

// const mintNFT = require("/home/manishmenaria/MBM/Biz4Solutions Coding/Final/Part 2/Frontend/fronend/scripts/mint-nft.js");

app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const pinataSDK = require("@pinata/sdk");

const multer = require("multer");

const axios = require("axios");

const pinata = new pinataSDK(keys.ApiKey, keys.SecretKey);

const fs = require("fs");

const instance = axios.create({
  maxContentLength: 100 * 1024 * 1024,
});

const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  dest: "uploads/",
});

app.post("/upload", upload.single("image"), (request, response) => {
  console.log(request.file.filename);

  let imageName = request.file.filename;

  const readableStreamForFile = fs.createReadStream("./uploads/" + imageName);

  const options = {
    pinataMetadata: {
      name: "BlockchainNFT_5",
      keyvalues: {
        customKey: "Blue",
        customKey2: "World",
      },
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };
  pinata
    .pinFileToIPFS(readableStreamForFile, options)
    .then((result) => {
      //handle results here

      console.log(result);
      deleteFile("./uploads/" + imageName);
      response.json(result);
    })
    .catch((err) => {
      //handle error here
      console.log(err);
    });

  // pinata
  //   .testAuthentication()
  //   .then((result) => {
  //     //handle successful authentication here
  //     console.log(result);
  //   })
  //   .catch((err) => {
  //     //handle error here
  //     console.log(err);
  //   });
});

async function deleteFile(filePath) {
  try {
    await fs.promises.unlink(filePath);
    console.log("File deleted successfully!");
  } catch (err) {
    console.error(err);
  }
}

// app.post("/mintNFT", (req, res) => {});

app.listen(5000, () => {
  console.log(`Listening at http://localhost:5000`);
});
