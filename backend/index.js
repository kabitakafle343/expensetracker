const express=require('express');
const {connectDB}=require("./config/db");
const userRoutes=require("./routes/user")
const expenseRoutes=require("./routes/expense")
const cors=require("cors")
require("dotenv").config();
const app=express();
app.use(cors())
app.use(express.json());
app.use("/api/users",userRoutes)
app.use("/api/expense",expenseRoutes)
app.listen(process.env.PORT,()=>{
    connectDB()
    console.log("server is running on port number",process.env.PORT)
})