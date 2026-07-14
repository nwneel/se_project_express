const router = require("express").Router();
const auth = require("../middleware/auth");
const itemsRouter = require("./clothingitem");
const usersRouter = require("./users");
const { createUser, login } = require("../controllers/users");
const { getItems } = require("../controllers/clothingitems");
const { HTTP_STATUS } = require("../utils/errors");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getItems);

router.use(auth);
router.use("/items", itemsRouter);
router.use("/users", usersRouter);

router.use((req, res) => {
  res
    .status(HTTP_STATUS.NOT_FOUND)
    .json({ message: "Requested resource not found" });
});

module.exports = router;
