const express = require('express'); 
const app = express(); 
const cors = require("cors");
require('dotenv').config();

const corsOptions = {
  origin: "*"
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
const shippingRoute = require('./routes/shipping'); 
const ordersRoute = require('./routes/orders'); 





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
app.use('/api/shipping', validateToken  , shippingRoute); 


// error handler middleware 
app.use(errorhandler); 



const port = process.env.PORT || 8000; 
redisClient.connect(); 

app.listen(port, '0.0.0.0' ,  async () => {
    await sequelize.authenticate().then(() => console.log('database connected')).catch((error) => console.log(error)); 
    console.log(`app is listening on port ${port}`);
}); 

