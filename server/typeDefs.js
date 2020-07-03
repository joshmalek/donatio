import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    user(_id: String!): User
    userLockedMedals(_id: String!): [Medal]
    users: [User]
    nonprofits: [Nonprofit]
    NPOofDay: Nonprofit
    medals: [Medal]
    weekReceipts(user_id: String!): [Receipt]
    initiateTwitterAuth: TwitterAuthResponse
    processTwitterAuth(oauth_token: String!, oauth_verifier: String!): Boolean
    monitorTwitterAuth(oauth_token: String!): TwitterAuthResponse
    sendTweet(
      access_token: String!
      access_token_secret: String!
      tweet: String!
    ): Boolean
    requestAmazonCreds(access_token: String!): AmazonUserData
    checkConfirmation(confirmation_key: String!): User
  }

  type Mutation {
    addNonprofit(
      vendor_id: String
      vendor_organization_reference: String
      name: String
    ): Nonprofit
    updateNonprofitPriority(_id: String!): Nonprofit
    setNPOofDay(_id: String!): Nonprofit
    processDonation(receipt_id: String!): DonationReward
    processAmazonPay(
      donation_amount: Float!
      currency_code: String!
      order_reference_id: String!
      user_id: String!
    ): AmazonPayResponse
    initiateEmailConfirmation(user_id: String!): Boolean
    setEmailConfirmed(user_id: String!): Boolean
  }

  type AmazonUserData {
    email: String
    first_name: String
    last_name: String
    user_id: String
  }

  type AmazonPayResponse {
    success: Boolean!
    receipt_id: ID
  }

  type Receipt {
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
    email_confirmed: Boolean
    confirmation_string: String
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
