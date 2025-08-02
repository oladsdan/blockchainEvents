// ecosystem.config.js
module.exports = {
  apps : [{
    name   : "contractEvents",
    script : "./index.js",
    instances: 1, // Or 'max' for all available CPU cores
    autorestart: true,
    watch: false, // Set to true for development, false for production
    max_memory_restart: '1G', // Restart if memory exceeds 1GB
    env: {
      NODE_ENV: "production",
    //   PORT: 3000, // Or whatever port is in your config/default.json
    BSC_RPC_URL:"https://bnb-mainnet.g.alchemy.com/v2/tJBRXMfo8dezfBWD7VlWB",
    BOT_CONTRACT:"0xa257b7cc03b962888c9812611fbcb843dd274477",
    "PORT":5001,
    BSC_RPC_SOC:"wss://bnb-mainnet.g.alchemy.com/v2/tJBRXMfo8dezfBWD7VlWB",
    MONGO_URI:"mongodb+srv://kalloello:pBjNQ91oft7yxweg@cluster0.80bue4c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

    }
  }]
};