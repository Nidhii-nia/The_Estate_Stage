import express from "express";
import ListingController from "../controllers/listing.controller.js";
import auth from "../middlewares/jwt.middleware.js";
const listingRouter = express.Router();

const listingController = new ListingController();

listingRouter.post("/create-listing", auth, listingController.addListing);

listingRouter.get(
  "/userListing/:userId",
  auth,
  listingController.fetchUserListing,
);

listingRouter.get("/search", listingController.searchListings);
listingRouter.get("/", listingController.fetchAllListings);
listingRouter.get("/:listingId", listingController.fetchListingById);
listingRouter.put(
  "/userListing/update/:userId/:listingId",
  auth,
  listingController.modifyUserListing,
);
listingRouter.patch(
  "/delete/:listingId",
  auth,
  listingController.removeListing,
);

export default listingRouter;
