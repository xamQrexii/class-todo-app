const express = require("express");
const morgan = require("morgan");
const path = require("path");

require("dotenv").config({
  path:
    process.env.NODE_ENV === "development"
      ? path.resolve(".env.development")
      : path.resolve(".env"),
});

const { connectDatabase } = require("./database");

const app = express();

connectDatabase();

app.use(morgan("dev"));
app.use(express.json({ extended: false }));
app.use("/api/v1", require("./routes"));

app.use((req, res) =>
  res.status(404).json({
    message: `API route not found`,
    route: `${req.hostname}${req.url}`,
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));
