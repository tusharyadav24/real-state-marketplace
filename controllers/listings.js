const Listing=require('../models/listing');
const maptilerClient = require('@maptiler/client');
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
module.exports.index=async (req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
};
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("owner").populate({path:"reviews",populate:{path:"author"}});
    if(!listing){
        req.flash("error","Listing you requested for does'nt exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing,mapToken: process.env.MAPTILER_API_KEY});
};
module.exports.createListing=async (req,res)=>{
    let response = await maptilerClient.geocoding.forward(req.body.listing.location, {
    limit: 1,
  });
        let url= req.file.path;
        let filename=req.file.filename;
        let {listing}=req.body;
        let newListing=new Listing(listing);
        newListing.image={filename,url};
        newListing.owner=req.user._id;
        newListing.geometry = response.features[0].geometry;
        await newListing.save();
        req.flash("success","New Listing Created !");
        res.redirect("/listings");
};
module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does'nt exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let { listing } = req.body;
    let updatedListing =await Listing.findByIdAndUpdate(id, listing, {
        runValidators: true
    });
    if(typeof req.file !=="undefined"){
    let filename=req.file.filename;
    let url=req.file.path
    updatedListing.image={url,filename};
    await updatedListing.save();
    }
    req.flash("success"," Listing Updated !");
    res.redirect(`/listings/${id}`);
};
module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id,{
        runValidators: true
    });
    req.flash("success","Listing deleted !");
    res.redirect("/listings");
};
module.exports.searchListing = async (req, res) => {
  let { location } = req.query;
  
  if (!location) {
    req.flash("error", "Please enter something to search!");
    return res.redirect("/listings");
  }
  let searchedLocation = await Listing.find({
    $or: [
      { country: { $regex: location.trim(), $options: "i" } },
      { location: { $regex: location.trim(), $options: "i" } },
      { title: { $regex: location.trim(), $options: "i" } }
    ]
  });
    if(searchedLocation.length === 0){
    req.flash("error", "listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/location.ejs", { searchedLocation, location });
};