import {ApolloServer, gql} from "apollo-server-express"
import express from 'express'
import mongoose from 'mongoose'
import {typeDefs} from '../typeDefs'
import {resolvers} from '../resolvers'
import dotenv from 'dotenv'

dotenv.config()

const startServer = async () => {

  const app = express ()
  const server = new ApolloServer({
    typeDefs,
    resolvers
  })
  console.log(process.env.ATLAS_URI)
  server.applyMiddleware({ app })
  const uri = process.env.ATLAS_URI;
  await mongoose.connect(uri, {useNewUrlParser: true})
        .then(() => {console.log(`Successfully connected to mongoose database`)},
              err => {console.log(`Error connecting to mongoose database`)})

  app.listen({ port: 4000 }, () => {
    console.log(`Server ready @ http://localhost:4000${server.graphqlPath}`)
  })

}

startServer ()
