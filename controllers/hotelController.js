const Hotel = require("../models/hotel");

exports.listAllHotels = async (req, res, next) => {
  try {
    const allHotels = await Hotel.find({ available: { $eq: true } });
    res.render("all_hotels", { title: "All Hotels", allHotels });
    //res.json(allHotels)
  } catch (error) {
    next(error);
  }
};

exports.listAllCountries = async (req, res, next) => {
  try {
    const allCountries = await Hotel.distinct("country");
    res.render("all_countries", { title: "Browse by Country", allCountries });
  } catch (error) {
    next(error);
  }
};

exports.homePageFilters = async (req, res, next) => {
  try {
    const hotels = await Hotel.aggregate([
      { $match: { available: true } },
      { $sample: { size: 9 } },
    ]);
    const countries = await Hotel.aggregate([
      { $group: { _id: "$country" } },
      { $sample: { size: 9 } },
    ]);

    const [filteredCountries, filteredHotels] = await Promise.all([
      countries,
      hotels,
    ]);

    res.render("index", { filteredCountries, filteredHotels });
    //res.json(countries)
  } catch (error) {
    next(error);
  }
};

exports.adminPage = (req, res) => {
  res.render("admin", { title: "Admin" });
};

exports.createHotelGet = (req, res) => {
  res.render("add_hotel", { title: "Add New Hotel" });
};

exports.createHotelPost = async (req, res, next) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    req.flash("success", `${hotel.hotel_name} created successfully`);
    res.redirect(`/all/${hotel._id}`);
  } catch (error) {
    next(error);
  }
};

exports.editRemoveGet = (req, res) => {
  res.render("edit_remove", { title: "Search for hotel to edit or remove" });
};

exports.editRemovePost = async (req, res, next) => {
  try {
    const hotelId = req.body.hotel_id || null;
    const hotelName = req.body.hotel_name || null;

    const hotelData = await Hotel.find({
      $or: [{ _id: hotelId }, { hotel_name: hotelName }],
    }).collation({
      locale: "en",
      strength: 2,
    });

    if (hotelData.length > 0) {
      res.render("hotel_detail", { title: "Add / Remove hotel", hotelData });
      return;
    } else {
      req.flash("info", "No matches were found...");
      res.redirect("/admin/edit-remove");
    }
  } catch (error) {
    next(error);
  }
};

exports.updateHotelGet = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ _id: req.params.hotelId });
    res.render("add_hotel", { title: "Update hotel", hotel });
  } catch (error) {
    next(error);
  }
};

exports.updateHotelPost = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findByIdAndUpdate(hotelId, req.body, {
      new: true,
    });
    req.flash("success", `${hotel.hotel_name} updated successfully`);
    res.redirect(`/all/${hotelId}`);
  } catch (error) {
    next(error);
  }
};

exports.deleteHotelGet = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findOne({ _id: hotelId });
    res.render("add_hotel", { title: "Delete Hotel", hotel });
  } catch (error) {
    next(error);
  }
};

exports.deleteHotelPost = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findByIdAndRemove({ _id: hotelId });
    req.flash("info", `Hotel ID:  ${hotelId} has been deleted`);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

exports.hotelDetail = async (req, res, next) => {
  try {
    const hotelParams = req.params.hotel;
    const hotelData = await Hotel.find({ _id: hotelParams });
    res.render("hotel_detail", { title: "Lets Travel", hotelData });
  } catch (error) {
    next(error);
  }
};

exports.hotelsByCountry = async (req, res, next) => {
  try {
    const countryParams = req.params.country;
    const countryList = await Hotel.find({ country: countryParams });
    res.render("hotels_by_country", {
      title: `Browse by country: ${countryParams}`,
      countryList,
    });
  } catch (error) {
    next(error);
  }
};

exports.searchResults = async (req, res, next) => {
  try {
    const searchQuery = req.body;
    const parsedStars = parseInt(searchQuery.stars) || 1;
    const parsedSort = parseInt(searchQuery.sort) || 1;
    const searchData = await Hotel.aggregate([
      { $match: { $text: { $search: `\"${searchQuery.destination}\"` } } },
      { $match: { available: true, star_rating: { $gte: parsedStars } } },
      { $sort: { cost_per_night: parsedSort } },
    ]);
    //res.json(searchData);
    res.render("search_results", {
      title: "Search Results",
      searchQuery,
      searchData,
    });
  } catch (error) {
    next(error);
  }
};
