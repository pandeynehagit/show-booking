const { addShow,
  deleteShow,
  updateShow,
  getAllShowByTheatre,
  getShowById,
  getAllTheatreByMovie} = require("../controllers/showController");
const router = require("express").Router();



// add show

router.post("/add-show",addShow);

// delete  show

router.delete("/delete-show/:showId",deleteShow );

// update show

router.put("/update-show", updateShow);

// get all shows by theatre

router.get("/get-all-shows-by-theatre/:theatreId",getAllShowByTheatre );

// get all theatres by movie which has shows

router.get("/get-all-theatres-by-movie/:movie/:date",getAllTheatreByMovie );

router.get("/get-show-by-id/:showId",getShowById );

module.exports = router;