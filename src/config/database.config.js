import mongoose from "mongoose"
import config from "./config.js"


export const connectDB = async ()=> {
    try{
        await mongoose.connect(config.mongoUrl),
        console.log ("Conexion a MongoDB exitosa")
    }catch (error){
        console.log ("Conexion a MongoDB erronea" + error)
    }

}