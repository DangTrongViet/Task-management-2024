const express = require("express");
const database = require("./config/database");
const cors=require("cors");
// cài body-parser để lấy req.body
const bodyParser = require("body-parser");
// cookier-parser
const cookieParser = require('cookie-parser');
// Nhúng npm dotenv để sử dụng biến trong file env
require("dotenv").config();

const routesApiVer1 = require("./api/v1/routes/index.route");

// kết nối database
database.connect();

const app = express();
const port = process.env.PORT;
// CORS
app.use(cors());
// parser-body với json
app.use(bodyParser.json()); // Đặt trước khi định nghĩa các route
// Cookie-parser
app.use(cookieParser());

// routes
routesApiVer1(app);

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
