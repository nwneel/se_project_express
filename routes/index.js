const router = require("express").Router();
const itemsRouter = require("./clothingitem");
const usersRouter = require("./users");
const { createUser, login } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/items", itemsRouter);
router.use("/users", usersRouter);

router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
