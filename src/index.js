import "dotenv/config";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
const port = process.env.PORT || 8000;



connectDB().then(()=>{
    app.on('error', (err) => {
        console.error('Server error:', err);
        throw err;
    });
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err)=>{
    console.log('MongoDb Connection Failed :', err);
    throw err;
});

