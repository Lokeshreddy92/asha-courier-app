const express = require("express");

const TokenController = require("../controllers/access-tokens");

const router = express.Router();

router.post("/create", TokenController.addToken);

router.get("/gettokens", TokenController.getTokens);

router.get("/:id", TokenController.getTokenById);

router.put("/:id", TokenController.updateToken);

router.delete("/:id", TokenController.deleteToken);

module.exports = router;
