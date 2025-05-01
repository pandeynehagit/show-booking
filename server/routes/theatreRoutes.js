const router = require("express").Router();
const {addTheatre,updateTheatre,deleteTheatre,getAllTheatre,getTheatreByOwner} = require("../controllers/theatreController"
)

router.post("/add-theatre",addTheatre );

router.put("/update-theatre", updateTheatre);

// delete theatre
router.delete("/delete-theatre/:theatreId",deleteTheatre );

// get all theatres - used by admin
router.get("/get-all-theatres",getAllTheatre );

// get my theatres - used by partner
router.get("/get-all-theatres-by-owner/:ownerId", getTheatreByOwner);

module.exports = router;