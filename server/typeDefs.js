import { gql } from "apollo-server-express"

export const typeDefs = gql`
  type Query {
    user(_id: String!): User
    users: [User]
    nonprofits: [Nonprofit]
    NPOofDay: Nonprofit
    medals: [Medal]
    initiateTwitterAuth: TwitterAuthResponse,
    processTwitterAuth(oauth_token: String!, oauth_verifier: String!): Boolean
    monitorTwitterAuth(oauth_token: String!): TwitterAuthResponse
    sendTweet(access_token: String!, access_token_secret: String!, tweet: String!): Boolean
  }

  type Mutation {
    addNonprofit(vendor_id: String, vendor_organization_reference: String, name: String): Nonprofit
    updateNonprofitPriority(_id: String!): Nonprofit
    setNPOofDay(_id: String!): Nonprofit
    processDonation(user_id: String!, donation_amount: Float!, currency_code: String!): DonationReward
  }

  type TwitterAuthResponse {
    oauth_token: String!,
    oauth_token_secret: String!
  }

  type DonationReward {
    previous_experience_value: Float!,
    experience_gained: Float!,
    total_donation: Float!,
    medals_unlocked: [Medal]!
  }

  type User {
    firstName: String!
    lastName: String!
    email: String!
    experience: Float!
    medals: [Medal]
    total_donated: Float!
    _id: ID!
  }

  type Medal {
    name: String!
    description: String!
    img_url: String!
    _id: ID!
    process_func: String!
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
