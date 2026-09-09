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

  getUserListing = async (userId) => {
    try {
      const checkUserAndGetListings = await Listing.find({
        userRef: userId,
        isDeleted: false,
      });
      console.log(checkUserAndGetListings);

      if (!checkUserAndGetListings) {
        throw new ApplicationLevelError("User doesn't exists!", 401);
      }

      return checkUserAndGetListings;
    } catch (error) {
      if (error instanceof ApplicationLevelError) {
        throw error;
      }

      throw new ApplicationLevelError(
        "Could not fetch the user listings!",
        500,
      );
    }
  };

  updateListing = async (userId, listingId, data) => {
    try {
      const listing = await Listing.findOneAndUpdate(
        { userRef: userId, _id: listingId },
        { $set: data },
        {
          returnDocument: "after",
        },
      );

      if (!listing) {
        throw new ApplicationLevelError("No such listing found!", 400);
      }

      return listing;
    } catch (error) {
      if (error instanceof ApplicationLevelError) {
        throw error;
      }
      if (error instanceof mongoose.Error.ValidationError) {
        const msg = error.errors.map((e) => e.message).join(", ");
        throw new ApplicationLevelError(msg, 400);
      }
      throw new ApplicationLevelError(
        "Could not update the listing! Something went wrong!",
        500,
      );
    }
  };

  getAllListings = async () => {
    try {
      const listings = await Listing.find({ isDeleted: false });
      return listings;
    } catch (error) {
      throw new ApplicationLevelError(error.message, 500);
    }
  };

  searchListings = async ({
    query = "",
    type = "all",
    offer = false,
    parking = false,
    furnished = false,
    sort = "latest",
    skip = 0,
    limit = 5,
  }) => {
    try {
      const filters = { isDeleted: false };
      const normalizedQuery = query.trim();

      if (normalizedQuery) {
        const safeQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const searchRegex = new RegExp(safeQuery, "i");
        const searchConditions = [
          { name: searchRegex },
          { address: searchRegex },
          { description: searchRegex },
          { sellerEmail: searchRegex },
          { sellerPhone: searchRegex },
          { type: searchRegex },
          { imageUrls: searchRegex },
        ];

        const numericQuery = Number(normalizedQuery);
        if (Number.isFinite(numericQuery)) {
          searchConditions.push(
            { regularPrice: numericQuery },
            { discountPrice: numericQuery },
            { beds: numericQuery },
            { bathrooms: numericQuery },
          );
        }

        if (["true", "false"].includes(normalizedQuery.toLowerCase())) {
          const booleanQuery = normalizedQuery.toLowerCase() === "true";
          searchConditions.push(
            { furnished: booleanQuery },
            { parking: booleanQuery },
            { offer: booleanQuery },
            { notAvailable: booleanQuery },
          );
        }

        if (mongoose.Types.ObjectId.isValid(normalizedQuery)) {
          searchConditions.push({ userRef: normalizedQuery });
        }

        filters.$or = searchConditions;
      }

      if (["rent", "sell"].includes(type)) filters.type = type;
      if (offer) filters.offer = true;
      if (parking) filters.parking = true;
      if (furnished) filters.furnished = true;

      const sortBy = sort === "price-low"
        ? { regularPrice: 1 }
        : sort === "price-high"
          ? { regularPrice: -1 }
          : { createdAt: -1 };
      const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 5);
      const safeSkip = Math.max(Number(skip) || 0, 0);
      const [listings, total] = await Promise.all([
        Listing.find(filters).sort(sortBy).skip(safeSkip).limit(safeLimit),
        Listing.countDocuments(filters),
      ]);

      return {
        listings,
        total,
        hasMore: safeSkip + listings.length < total,
      };
    } catch (error) {
      throw new ApplicationLevelError("Could not search listings!", 500);
    }
  };

  getListingById = async (listingId) => {
    try {
      const listing = await Listing.findOne({
        _id: listingId,
        isDeleted: false,
      });

      if (!listing) {
        throw new ApplicationLevelError("Listing not found!", 404);
      }

      return listing;
    } catch (error) {
      if (error instanceof ApplicationLevelError) {
        throw error;
      }

      throw new ApplicationLevelError("Could not fetch the listing!", 500);
    }
  };

  deleteListing = async (listingId) => {
    try {
      const updateListing = await Listing.findByIdAndUpdate(
        { _id: listingId },
        { $set: { isDeleted: true } },
        { returnDocument: "after" },
      );
      if (!updateListing) {
        throw new ApplicationLevelError("No such listings exists!", 404);
      }
      return updateListing;
    } catch (error) {
      if (error instanceof ApplicationLevelError) {
        throw error;
      }
      throw new ApplicationLevelError(
        "Could not delete listing.Something went wrong!",
        500,
      );
    }
  };
}
