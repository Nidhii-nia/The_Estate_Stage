import ListingRepository from "../repository/listing.repository.js";
import ApplicationLevelError from "../middlewares/applicationError.middleware.js";

export default class ListingController {
  constructor() {
    this.Listing = new ListingRepository();
  }

  addListing = async (req, res, next) => {
    try {
      const {
        name,
        description,
        address,
        sellerEmail,
        sellerPhone,
        regularPrice,
        discountPrice,
        bathrooms,
        beds,
        furnished,
        parking,
        type,
        offer,
        notAvailable,
        imageUrls,
      } = req.body;

      const userRef = req.body?.userRef?._id || req.body?.userRef?.id;

      if (!userRef) {
        throw new ApplicationLevelError("User authentication required", 401);
      }

      const listingObj = {
        name,
        description,
        address,
        sellerEmail,
        sellerPhone,
        regularPrice,
        discountPrice,
        bathrooms,
        beds,
        furnished,
        parking,
        type,
        offer,
        notAvailable,
        imageUrls,
        userRef,
      };

      const response = await this.Listing.createListing(listingObj);
      return res.status(200).json({
        success: true,
        message: "Listing created successfully!",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  fetchUserListing = async (req, res, next) => {
    try {
      if (req.user.userId !== req.params.userId) {
        return res.status(401).json({
          success: false,
          message: "User not authorized!",
        });
      }

      const response = await this.Listing.getUserListing(req.params.userId);
      console.log("Response fetchUserData: ", response);
      return res.status(200).json({
        success: true,
        message: "data fetched successfully!",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  modifyUserListing = async (req, res, next) => {
    try {
      if (req.user.userId !== req.params.userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated!",
        });
      }

      const {
        name,
        description,
        address,
        sellerEmail,
        sellerPhone,
        regularPrice,
        discountPrice,
        bathrooms,
        beds,
        furnished,
        parking,
        type,
        offer,
        notAvailable,
        imageUrls,
      } = req.body;

      const response = await this.Listing.updateListing(
        req.params.userId,
        req.params.listingId,
        {
          name,
          description,
          address,
          sellerEmail,
          sellerPhone,
          regularPrice,
          discountPrice,
          bathrooms,
          beds,
          furnished,
          parking,
          type,
          offer,
          notAvailable,
          imageUrls,
        },
      );

      return res.status(200).json({
        success: true,
        message: "Listing updated successfully!",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  fetchListingById = async (req, res, next) => {
    try {
      const response = await this.Listing.getListingById(req.params.listingId);

      return res.status(200).json({
        success: true,
        message: "Listing fetched successfully!",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  fetchAllListings = async (req, res, next) => {
    try {
      const response = await this.Listing.getAllListings();
      console.log("all listings: ", response);

      return res.status(200).json({
        success: true,
        message: "Listing fetched successfully!",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  searchListings = async (req, res, next) => {
    try {
      const response = await this.Listing.searchListings({
        query: req.query.query,
        type: req.query.type,
        offer: req.query.offer === "true",
        parking: req.query.parking === "true",
        furnished: req.query.furnished === "true",
        sort: req.query.sort,
        skip: req.query.skip,
        limit: 5,
      });

      return res.status(200).json({
        success: true,
        message: "Listings searched successfully!",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  removeListing = async(req,res,next) => {
    try {
      const response = await this.Listing.deleteListing(req.params.listingId);
      return res.status(200).json({
        success:true,
        message:"Document soft deleted successfully!",
        data:response,
      });
    } catch (error) {
      next(error);
    }
  }
}
