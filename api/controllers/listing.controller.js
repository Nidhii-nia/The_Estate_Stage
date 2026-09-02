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
        regularPrice,
        discountPrice,
        bathrooms,
        beds,
        furnished,
        parking,
        type,
        offer,
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
        regularPrice,
        discountPrice,
        bathrooms,
        beds,
        furnished,
        parking,
        type,
        offer,
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
      return response;
    } catch (error) {
      next(error);
    }
  };
}
