const express=require('express');
const mong=require('mongoose');
const { MONGO_URI } = require('./config');

const createUserRoutes=require('./routes/api/users');

const app = express();

//bodyParser
app.use(express.json()); 
mong.set('useCreateIndex', true);
//connect to MONGODB
mong.connect(MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>console.log('MongoDB connected'))
.catch(err=>console.log(err));

app.get('/',(req,res)=>{
    res.send("Hello From node")
})
//User Routes
app.use('/api/users',createUserRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server run at port ${PORT}`));
