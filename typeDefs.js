import { gql } from "apollo-server-express"

export const typeDefs = gql`
  type Query {
    hello: String!
    getUser(id: Int!): User
  }

  type Mutation {
    createUser(firstName: String!, lastName: String!): User!
    createPolicy(enactor: Int!, name: String!): Policy!
  }

  type User {
    firstName: String!
    lastName: String!
    id: Int!
    policies: [Policy]
  }

  type Policy {
    name: String!
    enactor: Int!
  }
`
