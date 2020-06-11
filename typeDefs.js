import { gql } from "apollo-server-express"

export const typeDefs = gql`
  type Query {
    getUser(id: String!): User
  }
  
  type User {
    firstName: String!
    lastName: String!
    email: String!
    experience: Int!
    medals: [Medal]
    total_donated: Float!
  }

  type Medal {
    name: String!
    description: String!
    img_url: String!
  }

  type NPO {
    name: String!
    org_id: String!
    priority: Int!
    amount_donated: Float!
  }
`
