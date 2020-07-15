import { ApolloServer } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import { typeDefs } from "../typeDefs";
import { resolvers } from "../resolvers";
import dotenv from "dotenv";
import { dailyNonprofitSelection } from "../cron_jobs/NonprofitSelection.cron";
import axios from "axios";
import { parse } from "qs";
import https from "https";
import http from "http";
import { fstat } from "fs";
import fs from "fs";
import cors from "cors";

dotenv.config();

const startServer = async () => {
  const app = express();
  app.use(cors());

  const configurations = {
    production: { ssl: true, port: 443, hostname: "3.130.4.139" },
    development: { ssl: false, port: 4000, hostname: "localhost" },
  };

  const environment = process.env.NODE_ENV || "production";
  const config = configurations[environment];

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
  });
  apollo.applyMiddleware({ app });

  var server;
  if (config.ssl) {
    server = https.createServer(
      {
        key: fs.readFileSync("server/src/ssl/server.key"),
        cert: fs.readFileSync("server/src/ssl/server.cert"),
      },
      app
    );
  } else {
    server = http.createServer(app);
  }

  const uri = process.env.ATLAS_URI;
  await mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`Successfully connected to mongoose database`);
    });

  server.listen({ port: config.port }, () => {
    // 3.130.4.139
    console.log(
      `Server ready @ http${config.ssl ? "s" : ""}://${config.hostname}/:${
      config.port
      }${apollo.graphqlPath}`
    );
  });

  // Start the cron jobs
  dailyNonprofitSelection.start();
};

startServer();
