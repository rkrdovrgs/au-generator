import * as express from "express";

const router = express.Router();

router.get("/api/students", (req, res) => {
    res.json("Hello World!");
});

module.exports = router;