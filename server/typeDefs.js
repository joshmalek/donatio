import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    user(_id: String!): User
    userLockedMedals(_id: String!): [Medal]
    users: [User]
    nonprofits: [Nonprofit]
    NPOofDay: Nonprofit
    medals: [Medal]
    weekReciepts(user_id: String!): [Reciept]
    initiateTwitterAuth: TwitterAuthResponse
    processTwitterAuth(oauth_token: String!, oauth_verifier: String!): Boolean
    monitorTwitterAuth(oauth_token: String!): TwitterAuthResponse
    sendTweet(
      access_token: String!
      access_token_secret: String!
      tweet: String!
    ): Boolean
  }

  type Mutation {
    addNonprofit(
      vendor_id: String
      vendor_organization_reference: String
      name: String
    ): Nonprofit
    updateNonprofitPriority(_id: String!): Nonprofit
    setNPOofDay(_id: String!): Nonprofit
    processDonation(reciept_id: String!): DonationReward
    processAmazonPay(
      donation_amount: Float!
      currency_code: String!
      order_reference_id: String!
    ): AmazonPayResponse
  }

  type AmazonPayResponse {
    success: Boolean!
    reciept_id: ID
  }

  type Reciept {
    npo_id: ID!
    user_id: ID!
    amount: Float!
    iso_dateTime: String
    claimed: Boolean
  }

  type TwitterAuthResponse {
    oauth_token: String!
    oauth_token_secret: String!
  }

  type DonationReward {
    previous_experience_value: Float!
    experience_gained: Float!
    total_donation: Float!
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
    alt_description: String
    asset_key: String
    _id: ID!
    process_func: String!
    date_awarded: String
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
`;
