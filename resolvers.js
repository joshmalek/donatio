import {MedalSchema} from './schemas/medal.schema'
import {UserSchema} from './schemas/user.schema'

export const resolvers = {
  Query: {
    hello: () => 'hello xd',
    getUser(_, { id }) {

      let user_ = database.users.find(user => user.id == id)
      if (user_ == null) return null

      console.log(policies)
      let user_policies = policies.filter(policy => policy.enactor == user_.id)
      console.log(user_policies)

      return {
        id: user_.id,
        firstName: user_.firstName,
        lastName: user_.lastName,
        policies: user_policies
      }

    }
  },
  Mutation: {
    createUser: (_, { firstName, lastName }) => {

      let new_user = {
        firstName,
        lastName
      }

      database.users.push(new_user)
      return new_user

    },
    createPolicy: (_, {enactor, name}) => {
      let new_policy = {
        name, enactor
      }

      policies.push(new_policy)
      return new_policy

    }
  }
}
