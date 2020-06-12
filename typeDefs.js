import { gql } from "apollo-server-express"

export const typeDefs = gql`
  type Query {
    user(id: String!): User
    nonprofits: [Nonprofit]
  }

  type Mutation {
    addNonprofit(vendor_id: String, vendor_organization_reference: String, name: String): Nonprofit
  }

  type User {
    firstName: String!
    lastName: String!
    email: String!
    experience: Int!
    medals: [Medal]
    total_donated: Float!
    id: ID!
  }

  type Medal {
    name: String!
    description: String!
    img_url: String!
    id: ID!
  }

  type Nonprofit {
    vendor_id: String!
    vendor_organization_reference: String!
    name: String!
    priority: Int!
    id: ID!
  }
`
