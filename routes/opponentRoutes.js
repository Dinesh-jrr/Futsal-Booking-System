const express = require('express');
const {opponentFind,getRequestCount,deleteRequest,getRequestsByUser}=require("../controllers/opponentController.js");

const router=express.Router();
router.post("/matchOpponent",opponentFind);
router.get("/requestCount/:userId", getRequestCount);
router.delete("/delete/:requestId",deleteRequest);
router.get("/user/:userId",getRequestsByUser)

module.exports=router;

