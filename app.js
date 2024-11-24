const express = require('express'); 
const app = express(); 
const cors = require("cors");
require('dotenv').config();

const corsOptions = {
    origin: "http://localhost:4200",
  };


// all imports 
const { sequelize } = require('./models'); 
const authRoutes = require('./routes/auth'); 
const homeRoutes = require('./routes/main'); 
const errorhandler = require('./middlewares/errorhandler'); 
const redisClient = require('./service/redis'); 
const ProductsRoute = require('./routes/products'); 





// middlewares 
app.use(express.json()); 
app.use(cors(corsOptions));

// endpoints 
app.use('/api', authRoutes); 
app.use('/api', homeRoutes); 
app.use('/api/product', ProductsRoute); 





// error handler middleware 
app.use(errorhandler); 

const port = process.env.PORT || 8000; 
redisClient.connect(); 

app.listen(port, async () => {
    await sequelize.authenticate().then(() => console.log('database connected')).catch((error) => console.log(error)); 
    console.log(`app is listening on port ${port}`);
}); 