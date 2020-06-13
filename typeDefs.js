import { gql } from "apollo-server-express"

export const typeDefs = gql`
  type Query {
    user(_id: String!): User
    nonprofits: [Nonprofit]
    NPOofDay: Nonprofit
  }

  type Mutation {
    addNonprofit(vendor_id: String, vendor_organization_reference: String, name: String): Nonprofit
    updateNonprofitPriority(_id: String!): Nonprofit
    setNPOofDay(_id: String!): Nonprofit
  }

  type User {
    firstName: String!
    lastName: String!
    email: String!
    experience: Int!
    medals: [Medal]
    total_donated: Float!
    _id: ID!
  }

  type Medal {
    name: String!
    description: String!
    img_url: String!
    _id: ID!
  }

  type Nonprofit {
    vendor_id: String!
    vendor_organization_reference: String!
    name: String!
    priority: Int!
    _id: ID!
  }

  type NPO {
    name: String!
    org_id: String!
    priority: Int!
    amount_donated: Float!
  }
`
