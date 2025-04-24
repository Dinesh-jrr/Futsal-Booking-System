const express = require('express');
const {opponentFind}=require("../controllers/opponentController.js");

const router=express.Router();
router.post("/matchOpponent",opponentFind);

module.exports=router;

