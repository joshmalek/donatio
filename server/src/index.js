import { ApolloServer } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import { typeDefs } from "../typeDefs";
import { resolvers } from "../resolvers";
import dotenv from "dotenv";
import { dailyNonprofitSelection } from "../cron_jobs/NonprofitSelection.cron";
import axios from "axios";
import { parse } from "qs";
import https from 'https';
import fs from 'fs';
import { fstat } from "fs";

dotenv.config();

const config = {
  prod: { ssl: true, port: 443, hostname: '3.21.56.172' }
}

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  server.applyMiddleware({ app });

  server = https.createServer({
    key: fs.readFile(`./src/server.key`),
    cert: fs.readFileSync(`./src/server.crt`)
  }, app);

  const uri = process.env.ATLAS_URI;
  await mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`Successfully connected to mongoose database`);
    });

  server.listen({ port: 4000 }, () => {
    console.log(`Server ready @ http://3.21.56.172/:4000${server.graphqlPath}`);
  });

  // Start the cron jobs

  dailyNonprofitSelection.start();
};

startServer();
