import { Lead, Kam, Poc} from "../models/index.js";
import mongoose from "mongoose";

// Create a new lead
export const createLead = async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      restaurantName,
      phoneNumber,
      address,
      callFrequency,
      email
    } = req.body;
    let KamId=res.locals.userId;
    const newLead = new Lead({
      restaurantName,
      phoneNumber,
      address,
      callFrequency,
      email,
      KamId
    });

    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    next(error);
  }
};



// Get all leads with details of associated POCs
export const getAllLeads = async (req, res) => {
  try {
    //find all leads with kamid=res.locals.userId and populate the 'pointOfContacts' field with details of associated POCs
    const leads = await Lead.find({ KamId: res.locals.userId }).populate("pointOfContacts");
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leads", error });
  }
};






// Get leads to be called today for a specific KAM
export const getLeadsToBeCalledToday = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date to the start of the day
  console.log(today);
  const kamId = res.locals.userId;

  try {
    const leads = await Lead.aggregate([
      {
        $match: {
          KamId: new mongoose.Types.ObjectId(kamId), // Ensure this matches leads associated with the specific KAM
        }
      },
      {
        $addFields: {
          nextCallDate: {
            $add: ["$lastContactedDate", { $multiply: ["$callFrequency", 1000 * 60 * 60 * 24] }]  // Adds the callFrequency in milliseconds
          }
        }
      },
      {
        $match: {
          $or: [
            {
              nextCallDate: today, // Compare nextCallDate to today's date
              leadStatus: "CONTACTED" // Assuming you only want leads that have been previously contacted
            },
            {
              leadStatus: "NEW" // Leads with a status of "NEW"
            }
          ]
        }}
    ]);

    res.status(200).json(leads);
  } catch (error) {
    console.error('Error fetching leads to be called today:', error);
    res.status(500).json({ message: "Failed to fetch leads to be called today", error: error.message });
  }
};




export const getTopPerformingRestaurants = async (req, res) => {
  const kamId = res.locals.userId; // Assuming the KamId is stored in res.locals.userId

  try {
    const topRestaurants = await Lead.aggregate([
      {
        $match: {
          leadStatus: "CONVERTED", // Filter for converted leads
          KamId: new mongoose.Types.ObjectId(kamId), // Ensure the leads are associated with the specific KAM
        }
      },
      {
        $group: {
          _id: {
            restaurantName: "$restaurantName", // Group by restaurant name
            restaurantId: "$_id" // Include the restaurant ID
          },
          totalOrderValue: { $sum: "$order" }, // Sum up all orders for each restaurant
          averageOrderValue: { $avg: "$order" }, // Calculate average order value
          leads: { $push: "$$ROOT" } // Collect all data related to the restaurant
        }
      },
      {
        $sort: { totalOrderValue: -1 } // Sort by total order value descending
      },
      {
        $limit: 3 // Limit to top 3
      },
      {
        $project: {
          _id: 0,
          RestaurantName: "$_id.restaurantName",
          RestaurantId: "$_id.restaurantId",
          TotalOrderValue: "$totalOrderValue",
          AverageOrderValue: "$averageOrderValue",
          Details: "$leads"
        }
      }
    ]);

    res.status(200).json(topRestaurants);
  } catch (error) {
    console.error('Error fetching top performing restaurants:', error);
    res.status(500).json({ message: "Failed to fetch top performing restaurants", error });
  }
};






