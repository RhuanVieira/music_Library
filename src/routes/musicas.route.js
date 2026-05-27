const express = require('express');
const router = express.Router();

const {createMusic, getMusicas, deleteMusicas, updateMusicas} = require('../controllers/musicas.controller');

router.post("/", createMusic);
router.get("/", getMusicas);
router.put("/:id", updateMusicas);
router.delete("/:id", deleteMusicas)

module.exports = router;
