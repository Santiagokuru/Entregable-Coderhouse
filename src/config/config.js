import dotenv from "dotenv";

dotenv.config();

const config = {
    port: process.env.PORT || 8080,
    mongoUrl: process.env.Mongodb_conection
}


export default config