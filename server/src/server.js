const http = require('http');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { mongoConnect } = require('./utils/mongo');

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log('Listening the port: ', PORT);
    })
}

startServer();