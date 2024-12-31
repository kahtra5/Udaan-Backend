import mongoose from "mongoose";


const kamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Phone number must be a 10 digit number"], // Basic phone number validation
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    }]

});


const Kam= mongoose.model('KAM', kamSchema);

export default Kam;