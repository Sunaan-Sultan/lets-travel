var express = require("express");
var router = express.Router();

//Require controllers:
const hotelController = require("../controllers/hotelController");
const userController = require("../controllers/userController");

/* GET home page. */
router.get("/", hotelController.homePageFilters);

router.get("/all", hotelController.listAllHotels);
router.get("/all/:hotel", hotelController.hotelDetail);
router.get("/countries", hotelController.listAllCountries);
router.get("/countries/:country", hotelController.hotelsByCountry);
router.post("/results", hotelController.searchResults);

router.get("/all/:name", function (req, res) {
  const name = req.params.name;
  res.render("all_hotels", { title: "All Hotels", name });
});

//ADMIN Routes
router.get("/admin", userController.isAdmin, hotelController.adminPage);
router.get("/admin/*", userController.isAdmin);
router.get("/admin/add", hotelController.createHotelGet);
router.post("/admin/add", hotelController.createHotelPost);
router.get("/admin/edit-remove", hotelController.editRemoveGet);
router.post("/admin/edit-remove", hotelController.editRemovePost);
router.get("/admin/:hotelId/update", hotelController.updateHotelGet);
router.post("/admin/:hotelId/update", hotelController.updateHotelPost);
router.get("/admin/:hotelId/delete", hotelController.deleteHotelGet);
router.post("/admin/:hotelId/delete", hotelController.deleteHotelPost);
router.get("/admin/orders", userController.allOrders);

//USER Routes
router.get("/sign-up", userController.signUpGet);
router.post("/sign-up", userController.signUpPost, userController.loginPost);
router.get("/login", userController.loginGet);
router.post("/login", userController.loginPost);
router.get("/logout", userController.logout);
router.get("/confirmation/:data", userController.bookingConfirmation);
router.get("/order-placed/:data", userController.orderPlaced);
router.get("/my-account", userController.myAccount);
router.get("/wishlist", userController.wishList);
router.get("/wishlistPlaced/:data", userController.wishListPlaced);

module.exports = router;
