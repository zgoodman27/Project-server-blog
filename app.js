import { config } from 'dotenv';
import express, { json, urlencoded } from 'express';
import routes from './controllers/routes.js';// Bring in routes
// Load environment variables from .env file
config();
const PORT = process.env.PORT || 3000;

// Initialize express app
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
// This is where we will bring in our front end

app.use("/",routes); 

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});