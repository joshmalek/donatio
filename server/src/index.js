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

dotenv.config();

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  server.applyMiddleware({ app });
  const uri = process.env.ATLAS_URI;
  await mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`Successfully connected to mongoose database`);
    });

  app.listen({ port: 4000 }, () => {
    console.log(`Server ready @ http://3.21.56.172/:4000${server.graphqlPath}`);
  });

  // Start the cron jobs

  dailyNonprofitSelection.start();
};

startServer();
