const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

 module.exports.indexListing = async (req ,res ) =>{
  const allListings = await  Listing.find({});// Fetch all listings from the database and convert to plain JavaScript objects
  res.render("listings/index.ejs", { allListings });
};



module.exports.new = async (req, res) => {
    res.render("listings/new.ejs");
 };

//show listing 
module.exports.showListing  = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({path: "reviews",
    populate: {
      path: "author", 
    },
  })
  .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings"); // Stops execution here and redirects safely
  } 
  res.render("listings/show.ejs", { listing });
}


module.exports.editnewListing = async (req ,res , next) =>{
  let response = await geocodingClient
  .forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send()  

  if (!response.body.features || response.body.features.length === 0) {
    req.flash("error", "Could not find that location. Please try another.");
    return res.redirect("/listings/new");
  }
  
  let url = req.file.path;
    let filename = req.file.filename;
    const newListing =  new Listing (req.body.listing);
    newListing.owner = req.user._id; 
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry; // Assign the geometry from Mapbox
    await newListing.save();
    req.flash("success", "New Listing Created"); 
    return res.redirect("/listings");
  }



// //edit route controller 

module.exports.editListing = async (req ,res ) =>{
  const { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", "Listing edit successfully"); 
  res.render("listings/edit.ejs", { listing });
}

// //update route controller 

module.exports.updateListing = async (req ,res ) =>{
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id , { ...req.body.listing }, { new: true });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated successfully"); 
  return res.redirect(`/listings/${id}`);
}


// //deletelisting route controller 

module.exports.deleteListing = async (req ,res ) =>{
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log(`Listing with ID ${id} has been deleted.`);
  req.flash("success", "Listing deleted"); 
  return res.redirect("/listings");
}