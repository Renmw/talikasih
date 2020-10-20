require("dotenv").config();
const express = require('express');
const app = express();
const {router} = require('./routes/index')
const errorHandler = require('./middlewares/errorHandler')

// console.log(process.env.PORT)
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use('/uploads', express.static('uploads'));

app.use(router);
app.use(errorHandler);

app.listen(port, () => console.log("Listening on port " + port));

