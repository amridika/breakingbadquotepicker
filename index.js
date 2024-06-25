import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const port = 3000;
const app = express();
const API_URL = "https://api.breakingbadquotes.xyz/v1/quotes";
const authorList = ["Jesse Pinkman", "Saul Goodman", "Walter White", "Gustavo Fring", "Mike Ehrmantraut", "Hank Schrader", "Marie Schrader", "Skyler White"];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(port, () => {
  console.log("Server running on port " + port);
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/random", async (req, res) => {
  try {
    var result = await axios.get(API_URL);
    const captionBB = result.data[0].quote;
    const authorBB = result.data[0].author;
    while (!authorList.includes(authorBB)) {
      result = await axios.get(API_URL);
    }
    res.render("random.ejs", { quote: captionBB, author: authorBB });
  } catch (error) {
    console.log(res.status(500));
    res.status(500);
  }
});

app.get("/custom", (req, res) => {
  res.render("custom.ejs", { authorList: authorList });
});

app.post("/customItem", async (req, res) => {
  var result = await axios.get(API_URL);
  var authorBB = result.data[0].author;
  const authorReq = req.body.author;
  while (authorReq != authorBB) {
    result = await axios.get(API_URL);
    authorBB = result.data[0].author;
  }
  const captionBB = result.data[0].quote;
  res.render("customItem.ejs", { quote: captionBB, author: authorBB });
});
