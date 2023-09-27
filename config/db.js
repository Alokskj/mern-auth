import mongoose from "mongoose"

export const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected : ${conn.connection.host}`)
    } catch (error) {
        console.log(`Failed to conned to DB error - ${error.message}`)
        process.exit(1)
    }
}