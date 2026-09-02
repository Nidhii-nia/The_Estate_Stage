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

export default listingRouter;
