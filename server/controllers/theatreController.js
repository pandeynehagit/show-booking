const Theatre = require("../models/theatreModel");

const addTheatre = async (req, res) => {
  try {
    const newTheatre = new Theatre(req.body); // create a new theatre object
    await newTheatre.save(); // save the theatre object to the database
    res.send({
      success: true,
      message: "New theatre added successfully",
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: err.message,
    });
  }
};

const updateTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.body.theatreId);
    if (!theatre) {
      return res.status(404).send({
        success: false,
        message: "Theatre not found",
      });
    }
    await Theatre.findByIdAndUpdate(req.body.theatreId, req.body);
    res.send({
      success: true,
      message: "Theatre updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: err.message,
    });
  }
};

const deleteTheatre =async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.body.theatreId);
    if (!theatre) {
      return res.status(404).send({
        success: false,
        message: "Theatre not found",
      });
    }
    await Theatre.findByIdAndDelete(req.params.theatreId);
    res.send({
      success: true,
      message: "Theatre deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: err.message,
    });
  }
};

const getAllTheatre = async (req, res) => {
  try {
    const allTheatres = await Theatre.find().populate("owner");
    console.log("all theater request are:", allTheatres);//populate:to get all the document corrosponding owner in sql joining 2 tables
    res.send({
      success: true,
      data: allTheatres,
      message: "All theatres fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: ("error in fetching all the theatre request",err.message),
    });
  }
};

const getTheatreByOwner = async (req, res) => {
  try {
    const allTheatres = await Theatre.find({ owner: req.params.ownerId });
    res.send({
      success: true,
      data: allTheatres,
      message: "All theatres fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: err.message,
    });
  }
}
module.exports ={addTheatre,updateTheatre,deleteTheatre,getAllTheatre,getTheatreByOwner}