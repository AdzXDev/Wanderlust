const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); 
const mapToken = process.env.Map_Token;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index route
module.exports.index= async(req,res)=>{
    const allListings= await Listing.find({});
     res.render("listings/index.ejs",{allListings});
     };

//new route
module.exports.renderNew=(req,res)=>{
        console.log(req.user)
       
           res.render("listings/new.ejs");
     };     

// show route     
module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const  listing= await Listing.findById(id)
    .populate({path:"reviews", populate:{path:"author",},})
    .populate("owner");
    if(!listing){
     req.flash("error","Listing you requested for does not exist");
     res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
  };

//create route  
module.exports.createListing= async(req,res,next)=>{
    //extracting from form 
 //    let{title,description,image,price,location,country}=req.body;
 //    let listing = req.body;
 
  //it means they are send listing post req but not data about listing
  //400 means bad request.  
  // let response=  await geocodingClient.forwardGeocode({
  //   query: req.body.listing.location,
  //   limit: 1
  // })
  // .send();


  let url = req.file.path;
  let filename= req.file.filename;
  const newListing= new Listing (req.body.listing); //module instance
  newListing.owner = req.user._id;  //passport by default store user related info in req object
  newListing.image= {url,filename};
   
  // newListing.geometry = response.body.features[0].geometry;
  
  // let savedListings = 
  await newListing.save(); 
  
  console.log(savedListings);
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
 };
 
//edit route 
module.exports.renderEditForm =async(req,res)=>{
    let {id} = req.params;
    const  listing= await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing you requested for does not exist");
       res.redirect("/listings");
      }

    let originalImageUrl= listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");  
    res.render("listings/edit.ejs",{listing,originalImageUrl});

};

//update route
module.exports.updateListing= async(req,res)=>{
   let{id} =req.params;
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});//deconstructing  the js object i.e listing which has every parameters
   
   if ( typeof req.file!=="undefined")
   {
   let url = req.file.path;
   let filename= req.file.filename;
   listing.image={url,filename};
   }
   await listing.save();
   
   req.flash("success","Listing Updated!");
   res.redirect(`/listings/${id}`);
};

//delete or destroy route
module.exports.destroyListing  =async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," Listing Deleted!");
    res.redirect("/listings");
};
