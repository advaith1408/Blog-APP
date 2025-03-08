const exp=require("express")
const app=exp();
require('dotenv').config();
const mongoose=require("mongoose")
const userApp=require("./APIs/userApi");
const authorApp=require("./APIs/authorApi");
const adminApp=require("./APIs/adminApi");
const cors=require('cors')
app.use(cors())
const port=process.env.PORT || 4000;


mongoose.connect(process.env.DBURL)
.then(()=>{
    app.listen(port,()=>console.log(`server listening on port ${port}..`))
    console.log("BD connection success")
})
.catch(err => console.log("Error in DB connection", err))



app.use(exp.json())
app.use('/user-api',userApp);
app.use('/author-api',authorApp);
app.use('/admin-api',adminApp);


//error handler 
app.use((err,req,resizeBy,next)=>{
    console.log("err object in express error handle:",err)

    res.send({message:err.message})
})