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
            order,  // Captures the monetary value or count of an order placed during the interaction
        } = req.body;

        const newInteraction = new Interaction({
            restaurantId,
            contactedPOCId,
            interactionDate,
            interactionType,
            details,
            order
        });

        // Save the new interaction to the database
        const savedInteraction = await newInteraction.save();

        // Update the Point of Contact with the new interaction ID
        await Poc.updateOne(
            { _id: contactedPOCId },
            { $push: { interactions: savedInteraction._id } }
        );

        // Prepare the data to update the lead
        const leadUpdateData = {
            $push: { interactions: savedInteraction._id },
            $set: { lastContactedDate: interactionDate }
        };

        // Check if there is an order value and update lead accordingly
        if (order > 0) {
            leadUpdateData.$set.leadStatus = "CONVERTED";
            leadUpdateData.$inc = { order: order };  // Increment 'order' by the order
        } else {
            // Ensure the status is set to 'CONTACTED' if no order is placed and not already in a later stage
            if (!newInteraction.leadStatus || newInteraction.leadStatus === "NEW") {
                leadUpdateData.$set.leadStatus = "CONTACTED";
            }
        }

        // Update the lead with the new status and interaction details
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
            .sort({ interactionDate: 1 }); // Sort interactions by date
        res.status(200).json(interactions);
    } catch (error) {
        console.error('Error fetching interactions:', error);
        res.status(500).json({ message: "Failed to fetch interactions", error });
    }
};

