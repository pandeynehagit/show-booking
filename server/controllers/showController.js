const Show = require("../models/showModel");
const addShow = async (req, res) => {
  try {
    const newShow = new Show(req.body);
    await newShow.save();
    res.send({
      success: true,
      message: "Show added successfully",
      data: newShow,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const deleteShow =async (req, res) => {
  try {
    await Show.findByIdAndDelete(req.params.showId);
    res.send({
      success: true,
      message: "Show deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
 const updateShow = async (req, res) => {
   try {
     const show = await Show.findByIdAndUpdate(req.body.showId, req.body, {
       new: true,
     });
     if (!show) {
       return res.status(404).json({ msg: "Show not found" });
     }
     res.send({
       success: true,
       message: "Show updated successfully",
     });
   } catch (err) {
     return res.status(500).json({ msg: err.message });
   }
 };

 const getAllShowByTheatre =async (req, res) => {
   try {
     const shows = await Show.find({ theatre: req.params.theatreId }).populate(
       "movie"
     );
     res.send({
       success: true,
       message: "Shows fetched successfully",
       data: shows,
     });
   } catch (err) {
     return res.status(500).json({ msg: err.message });
   }
 };
 const getAllTheatreByMovie = async (req, res) => {
  try {
    /**
     * retrieve all shows by movie and date - Show.find({movie, date})
     * filter out unique theatres from the shows
     * against the unique theatres, get the theatre show detils ( IMAX : 10:00 AM, 12:00 PM, 2:00 PM, INOX: 11:00 AM, 1:00 PM, 3:00 PM)
     */

    const { movie, date } = req.params;
    const shows = await Show.find({ movie, date }).populate("theatre"); // [ {theatre: {name: "IMAX"}, {theatre: {name: "INOX"}}]

    // filter out the unique theatres

    const uniqueTheatres = [];
    shows.forEach((show) => {
      const isTheatre = uniqueTheatres.find(
        (theatre) => theatre._id === show.theatre._id
      );
      if (!isTheatre) {
        // uniqueTheatres.push(show.theatre);
        let showsOfTheatre = shows.filter(
          (showObj) => showObj.theatre._id === show.theatre._id
        );
        uniqueTheatres.push({ ...show.theatre._doc, shows: showsOfTheatre });
      }
    });
    res.send({
      success: true,
      message: "Theatres fetched successfully",
      data: uniqueTheatres,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getShowById =  async (req, res) => {
  try {
    const show = await Show
      .findById(req.params.showId)
      .populate("movie")
      .populate("theatre");
    res.send({
      success: true,
      message: "Show has been fetched",
      data: show,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};
module.exports = {
  addShow,
  deleteShow,
  updateShow,
  getAllShowByTheatre,
  getShowById,
  getAllTheatreByMovie
};