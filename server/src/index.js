import { ApolloServer } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import { typeDefs } from "../typeDefs";
import { resolvers } from "../resolvers";
import dotenv from "dotenv";
import { dailyNonprofitSelection } from "../cron_jobs/NonprofitSelection.cron";

import Twitter from "twitter";
import TwitterLite from "twitter-lite";

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
    console.log(`Server ready @ http://localhost:4000${server.graphqlPath}`);
  });

  // Start the cron jobs
  dailyNonprofitSelection.start();

  // test Twitter
  // let twitterClient = new Twitter({
  //   consumer_key: "ElvTnb0OJ3J9DSF9cCI3HZXTl",
  //   consumer_secret: "807do5gaUWt4q5WPZH4pvPOyGczFtyzRoEktlSbiJ0lFqSXcNM",
  //   access_token_key: "1156293643847778304-ynj8MT2RMFWGKHaGNov3GmYJMEtPWI",
  //   access_token_secret: "wQdphX3LTHkqfCaIEbC9HgKYq3lBD19mPBtUqjosjHiaK",
  // })
  // console.log(twitterClient)
  // twitterClient.post('statuses/update', {status: "Sample Tweet through Twitter API!"}, (error, tweets, response) => {
  //   if (error) console.log(error)
  //   else {
  //     console.log(tweets)
  //     console.log(response)
  //   }
  // })

  // test Twitter Lite
  // console.log(`Configuring Twitter Lite...`)
  // const twitterLiteClient = new TwitterLite({
  //   consumer_key: 'ElvTnb0OJ3J9DSF9cCI3HZXTl',
  //   consumer_secret: '807do5gaUWt4q5WPZH4pvPOyGczFtyzRoEktlSbiJ0lFqSXcNM'
  // })

  // twitterLiteClient.getRequestToken("https://donatio-site.herokuapp.com/twitter")
  // .then(res => {
  //   console.log(res)
  // })
  // .catch(err => {
  //   console.log(err)
  // })
};

startServer();
