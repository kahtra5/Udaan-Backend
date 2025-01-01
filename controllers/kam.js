import { Kam } from '../models/index.js';
import { generateToken } from '../utils/jwt.js'; 
import bcrypt from 'bcryptjs';



//signup
export const signup = async (req, res, next) => {
    try {
        console.log(req.body);
        const { name, email, phone, username, password } = req.body;

        
        const existingUser = await Kam.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newKam = new Kam({
            name,
            email,
            phone,
            username,
            password: hashedPassword
        });

        const savedKam = await newKam.save();
        res.status(201).json({ message: "User registered successfully!", user: { id: savedKam._id, username: savedKam.username } });
    } catch (error) {
        console.error('Error signing up KAM:', error);
        next(error);
    }
};


//login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const kam = await Kam.findOne({ username });
        if (!kam) {
            return res.status(401).json({ message: 'User not found' });
        }

        
        const isMatch = await bcrypt.compare(password, kam.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        
        const token = generateToken(kam._id);

        
        res.cookie('token', token, {
            httpOnly: true,  // The cookie is not accessible via JavaScript; only to the server
            secure: true,  // Use secure cookies in production (https only)
            sameSite: 'None',
            maxAge: 3600000,
            partitioned: true// The cookie is sent only to the same site as the origin of the request
        });

        // Send the response with the token set in the cookie
        res.status(200).json({
            message: 'Login successful',
            user: { id: kam._id, username: kam.username }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};
