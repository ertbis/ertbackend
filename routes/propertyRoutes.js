const express =require("express");

const {body, param} = require("express-validator");
const { verifyToken } = require("../middlewares/validateToken");
const { createProperty, showMyProperty, deleteProperty, showAllProperties, getSingleProperty, showSingleProperty, updateProperty, getPropertyByQuery, getAllPropertiesForAdmin, getAllPendingPropertiesForAdmin } = require("../controllers/PropertyController");



const router = express.Router();
const validationParam = [
    body('apartment')
    .trim()
    .isString()
    .withMessage('Apartment must be a string')
    .notEmpty()
    .withMessage('Apartment field is required'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number'),
  ];


  

router.post("/", verifyToken,  validationParam, createProperty )

router.get("/me", verifyToken, showMyProperty )
router.get("/getall", getAllPropertiesForAdmin)
router.get('/getpending', getAllPendingPropertiesForAdmin)
router.post("/filter", getPropertyByQuery)
router.get("/", showAllProperties )
router.get("/:id", showSingleProperty)

router.put("/:id", verifyToken, updateProperty )

router.delete("/:id", verifyToken, deleteProperty )





module.exports = { router };