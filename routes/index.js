const router = require("express").Router();
const auth = require("../middleware/auth");
const itemsRouter = require("./clothingitem");
const usersRouter = require("./users");
const { createUser, login } = require("../controllers/users");
const { getItems } = require("../controllers/clothingitems");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getItems);

router.use(auth);
router.use("/items", itemsRouter);
router.use("/users", usersRouter);

router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
