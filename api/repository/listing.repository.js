import mongoose from "mongoose";
import ApplicationLevelError from "../middlewares/applicationError.middleware.js";
import Listing from "../models/listing.model.js";

export default class ListingRepository {
  createListing = async (data) => {
    try {
      // 1. Business Logic Validation for Discount Price
      if (data.offer) {
        const discount = Number(data.discountPrice);
        const regular = Number(data.regularPrice);

        if (!discount || discount <= 0 || discount >= regular) {
          throw new ApplicationLevelError(
            "Discount price must be greater than 0 and less than regular price!",
            400,
          );
        }
      }

      // 2. Create and populate document
      const newListing = await Listing.create(data);
      await newListing.populate("userRef", "username email avatar");

      return newListing;
    } catch (error) {
      console.log("Create Listing Repo: ", error.message);

      // Rethrow custom application errors directly
      if (error instanceof ApplicationLevelError) {
        throw error;
      }

      // Handle Mongoose Schema Validation errors correctly
      if (error instanceof mongoose.Error.ValidationError) {
        const errorMsg = Object.values(error.errors)
          .map((err) => err.message)
          .join(", ");
        throw new ApplicationLevelError(errorMsg, 400);
      }
      console.log("Something went wrong listing repo:", error.message);

      throw new ApplicationLevelError("Something went wrong!", 500);
    }
  };

  getUserListing = async(userId) => {
    try {
      const checkUserAndGetListings = await Listing.findById(userId);

      if(!checkUserAndGetListings){
        throw new ApplicationLevelError("User doesn't exists!", 401);
      }

      return checkUserAndGetListings;
    } catch (error) {
      if(error instanceof ApplicationLevelError){
        throw error;
      }

      throw new ApplicationLevelError("Could not fetch the user listings!",500);
    }
  }
}
