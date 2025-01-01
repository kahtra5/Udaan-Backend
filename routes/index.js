import express from "express";
import { lead, poc, interaction,kam} from "../controllers/index.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();


router.post("/addleads",authenticateToken,lead.createLead);
router.get("/getleads" , authenticateToken, lead.getAllLeads);
router.post('/addpoc',authenticateToken, poc.createPoc);
router.post('/addinteraction',authenticateToken, interaction.createInteraction);
router.get('/leads/today', authenticateToken, lead.getLeadsToBeCalledToday);
router.get('/leads/top', authenticateToken, lead.getTopPerformingRestaurants);
router.post('/getpocs', poc.getAllPocs);
router.post('/signup', kam.signup);
router.post('/login', kam.login);
router.post('/getinteractions', authenticateToken, interaction.getInteractionsByRestaurantId);



export default router;
