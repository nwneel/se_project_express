const router = require("express").Router();
const itemsRouter = require("./clothingitem");
const usersRouter = require("./users");

router.use("/items", itemsRouter);
router.use("/users", usersRouter);

router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
