const Property = require("../models/Property");
const { validateBody } = require("../utils/utilityFunctions");
const { cloudinary } = require("../utils/cloudinary");


// Import the Property model (assuming you have a "Property" model defined).

// Define a controller function for creating a property
const createProperty = async (req, res) => {
  // Validate the incoming request using Express Validator
  if (validateBody(req, res)) {
    return;
  }

  // Extract data from the request
  const { apartment, amount, images, location, about, features, mainFeatures } = req.body;

  // Save images to Cloudinary and get their links
  const imageUrls = [];
 // Assuming "images" is a field in your form for file uploads

  if (images && images.length > 0) {
    for (const image of images) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image, (err, result)=>{
        if (err) {
          return res.status(500).json({ message: "Image upload failed" , err});
        }
      });
      imageUrls.push(cloudinaryResponse.secure_url);
    }
  }

  // Create a new Property instance
  const newProperty = new Property({
    apartment,
    images: imageUrls, // Store Cloudinary image links
    amount,
    location,
    about,
    features,
    mainFeatures,
    owner : req.user.user_id
  });

  // Save the property to the database
  try {
    await newProperty.save();
    return res.status(201).json({ message: "Property created successfully", property: newProperty });
  } catch (error) {
    return res.status(500).json({ message: "Error creating the property",  error : error.message });
  }
};



const showMyProperty = async (req, res)=> {
    const user = req.user 
    try {
        const  properties = await Property.find({ owner: user.user_id })
        if(!properties){
            return res.status(404).json({message:"property  not found"})
        }

        res.status(200).json( properties )
    } catch (error) {
        return res.status(500).json({ message: "Error creating the property",  error : error.message });

    }

}
module.exports = { createProperty ,showMyProperty };
