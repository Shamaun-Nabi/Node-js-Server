const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 5000;

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Amra user er request peyechi");
  res.send("Welcome to My Server");
});

app.get("/api/data", (req, res) => {
  const filePath = path.join(__dirname, "data", "sampleData.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.send("Failed to Read Database");
    }

    const jsonData = JSON.parse(data);
    res.send(jsonData);
  });
});

app.post("/api/data", (req, res) => {
  const userData = req.body;
  const filePath = path.join(__dirname, "data", "sampleData.json");

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.send({
        message: "Failed",
      });
    }

    const jsonData = JSON.parse(data);

    userData.id =
      jsonData.length > 0 ? jsonData[jsonData.length - 1].id + 1 : 1;

    jsonData.push(userData);

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.json({ error: "Failed to Write" });
      }
      res.status(201).json({
        message: "done",
        data: userData,
      });
    });
  });
});

app.delete("/api/data/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const filePath = path.join(__dirname, "data", "sampleData.json");

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.send({
        message: "Failed",
      });
    }

    let jsonData = JSON.parse(data);

    const itemIndex = jsonData.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return res.send("Item not Found");
    }

    jsonData.splice(itemIndex, 1);

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      res.send({
        message: "Item Deleted",
      });
    });
  });
});

app.put("/api/data/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;
  const filePath = path.join(__dirname, "data", "sampleData.json");

  fs.readFile(filePath, "utf-8", (err, data) => {
    let jsonData = JSON.parse(data);
    const itemIndex = jsonData.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return res.send("Item not Found");
    }
    jsonData[itemIndex] = { ...jsonData[itemIndex], ...updatedData };

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      res.send({
        message: "Updated",
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is Running On http://localhost:${port}`);
});
