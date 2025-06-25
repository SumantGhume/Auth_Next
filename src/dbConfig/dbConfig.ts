import mongoose from "mongoose";
export async function connect () {
    try{
        mongoose.connect(process.env.MONGODB_URI!);
        const connection = mongoose.connection;


        connection.on('connected',()=>{
            console.log("MongoDB Connected successfully")
        })

        connection.on('error',(err)=>{
            console.log("MongoDB connection Error, please check :"+err)
            process.exit();
        })
    }catch(error){
        console.log('Something goes Wrong!');
        console.log(error)
    }
}