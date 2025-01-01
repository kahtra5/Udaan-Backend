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
    
    const leads = await Lead.find({ KamId: res.locals.userId }).populate("pointOfContacts");
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leads", error });
  }
};






// Get leads to be called today for a specific KAM
export const getLeadsToBeCalledToday = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  console.log(today);
  const kamId = res.locals.userId;

  try {
    const leads = await Lead.aggregate([
      {
        $match: {
          KamId: new mongoose.Types.ObjectId(kamId), 
        }
      },
      {
        $addFields: {
          nextCallDate: {
            $add: ["$lastContactedDate", { $multiply: ["$callFrequency", 1000 * 60 * 60 * 24] }]  
          }
        }
      },
      {
        $match: {
          $or: [
            {
              nextCallDate: today, 
              leadStatus: "CONTACTED" 
            },
            {
              leadStatus: "NEW" 
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



//get top three reataurants by order value
export const getTopPerformingRestaurants = async (req, res) => {
  const kamId = res.locals.userId; 

  try {
    const topRestaurants = await Lead.aggregate([
      {
        $match: {
          leadStatus: "CONVERTED", 
          KamId: new mongoose.Types.ObjectId(kamId), 
        }
      },
      {
        $group: {
          _id: {
            restaurantName: "$restaurantName", 
            restaurantId: "$_id" 
          },
          totalOrderValue: { $sum: "$order" }, 
          averageOrderValue: { $avg: "$order" }, 
          leads: { $push: "$$ROOT" } 
        }
      },
      {
        $sort: { totalOrderValue: -1 } 
      },
      {
        $limit: 3 
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






