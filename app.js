const express = require('express'); 
const app = express(); 
const cors = require("cors");
require('dotenv').config();

const corsOptions = {
    origin: "http://localhost:4200",
  };


// all imports 
const {  sequelize } = require('./models'); 





// middlewares 
app.use(express.json()); 
app.use(cors(corsOptions));


const port = process.env.PORT || 8000; 

app.listen(port, async () => {
    await sequelize.authenticate().then(() => console.log('database connected')).catch((error) => console.log(error)); 
    console.log(`app is listening on port ${port}`);
}); 