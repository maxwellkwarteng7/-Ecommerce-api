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
const categoryRoute = require('./routes/category'); 
const cartRoute = require('./routes/cart'); 
const paymentRoute = require('./routes/payment'); 
const validateToken = require('./middlewares/tokenValidator');
const reviewsRoute = require('./routes/reviews'); 
const { StatusCodes } = require('http-status-codes');





// middlewares 
app.use(express.json()); 
app.use(cors(corsOptions));

// endpoints 
app.use('/api', authRoutes); 
app.use('/api', homeRoutes); 
app.use('/api/product', ProductsRoute); 
app.use('/api/category', categoryRoute); 
app.use('/api/cart', cartRoute); 
app.use('/api/paystack', validateToken, paymentRoute); 
app.use('/api/reviews',reviewsRoute); 




// error handler middleware 
app.use(errorhandler); 



const port = process.env.PORT || 8000; 
redisClient.connect(); 

app.listen(port, async () => {
    await sequelize.authenticate().then(() => console.log('database connected')).catch((error) => console.log(error)); 
    console.log(`app is listening on port ${port}`);
}); 

