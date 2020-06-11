import {ApolloServer, gql} from "apollo-server-express"
import express from 'express'
import mongoose from 'mongoose'
import {typeDefs} from '../typeDefs'
import {resolvers} from '../resolvers'

const startServer = async () => {

  const app = express ()
  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  server.applyMiddleware({ app })

  await mongoose.connect("mongodb://localhost:27017/donatio", {useNewUrlParser: true})
        .then(() => {console.log(`Successfully connected to mongoose database`)},
              err => {console.log(`Error connecting to mongoose database`)})

  app.listen({ port: 4000 }, () => {
    console.log(`Server ready @ http://localhost:4000${server.graphqlPath}`)
  })

}

startServer ()
