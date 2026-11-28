const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateListing } = require("../middleware.js");
const controllerListing = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index & Create Listing
router
  .route("/")
  .get(wrapAsync(controllerListing.indexListing))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(controllerListing.createListing) // Change to editnewListing only if your controller exports that exact name
  );

// New Listing Form
router.get("/new", isLoggedIn, wrapAsync(controllerListing.new));

// Show, Update & Delete Listing
router
  .route("/:id")
  .get(wrapAsync(controllerListing.showListing))
  .put(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(controllerListing.updateListing)
  )
  .delete(isLoggedIn, wrapAsync(controllerListing.deleteListing));

// Edit Listing Form
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(controllerListing.editListing)
);

module.exports = router;