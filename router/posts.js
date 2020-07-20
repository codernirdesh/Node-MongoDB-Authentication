const router = require("express").Router();
const verify = require("./validateToken");

router.get("/", verify, (req, res) => {
  res.json({
    title: "My Post Title",
    description: "RANDOM SYSTEM GENERATED!!",
  });
});

module.exports = router;
