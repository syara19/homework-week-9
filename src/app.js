const express = require("express");
const app = express();
const port = 3000;
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerJson = require("./docs/swagger.json");
const morgan = require("morgan");

app.use(morgan("short"));
app.use("/apicdocs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);
app.use(errorHandler);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
