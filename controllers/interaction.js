import { Interaction, Poc, Lead } from "../models/index.js";
import interaction from "../models/interaction.js";

// Create new interaction
export const createInteraction = async (req, res, next) => {
    try {
        console.log(req.body);
        const {
            restaurantId,
            contactedPOCId,
            interactionDate,
            interactionType,
            details,
            order,  
        } = req.body;

        const newInteraction = new Interaction({
            restaurantId,
            contactedPOCId,
            interactionDate,
            interactionType,
            details,
            order
        });

        
        const savedInteraction = await newInteraction.save();

        
        await Poc.updateOne(
            { _id: contactedPOCId },
            { $push: { interactions: savedInteraction._id } }
        );

        
        const leadUpdateData = {
            $push: { interactions: savedInteraction._id },
            $set: { lastContactedDate: interactionDate }
        };

        
        if (order > 0) {
            leadUpdateData.$set.leadStatus = "CONVERTED";
            leadUpdateData.$inc = { order: order };  
        } else {
            
            if (!newInteraction.leadStatus || newInteraction.leadStatus === "NEW") {
                leadUpdateData.$set.leadStatus = "CONTACTED";
            }
        }

        
        await Lead.updateOne(
            { _id: restaurantId },
            leadUpdateData
        );

        res.status(201).json(savedInteraction);
    } catch (error) {
        console.error('Error creating interaction:', error);
        res.status(500).json({ message: "Failed to create interaction", error });
    }
}




// get interactions by restaurant id
export const getInteractionsByRestaurantId = async (req, res) => {
    const { restaurantId } = req.body;

    if (!restaurantId) {
        return res.status(400).json({ message: "RestaurantId is required" });
    }

    try {
        const interactions = await Interaction.find({ restaurantId })
            .sort({ interactionDate: 1 }); 
        res.status(200).json(interactions);
    } catch (error) {
        console.error('Error fetching interactions:', error);
        res.status(500).json({ message: "Failed to fetch interactions", error });
    }
};

