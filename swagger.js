const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory API",
      version: "1.0.0",
      description: "Inventory API built with Node.js, Express, and MongoDB Atlas",
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production"
          ? "https://zentiels-inventory.vercel.app"
          : "http://localhost:3000",
      },
    ],
  },
  apis: ["./server.js"],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
