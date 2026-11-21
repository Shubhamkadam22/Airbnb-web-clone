const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateListing } = require("../middleware.js");
const controllerListing = require("../controller/listing.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
// Index & Create Listing
router
  .route("/")
  .get(wrapAsync(controllerListing.indexListing))
  .post ( upload.single('listing[image]'),(req , res) => {
   res.send(req.file);
})
 /*  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(controllerListing.editnewListing) // check if your controller exports this as createListing
  ); */

// New Listing Form
router.get("/new", isLoggedIn, wrapAsync(controllerListing.new));

// Show, Update & Delete Listing
router
  .route("/:id")
  .get(wrapAsync(controllerListing.showListing))
  .put(
    isLoggedIn,
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