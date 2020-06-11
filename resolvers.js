import Medal from './schemas/medal.schema'
import User from './schemas/user.schema'

export const resolvers = {
  Query: {
    getUser(_, {id}){
      User
    }


  },

  Mutation: {

  },

  User: {

  },

  Medal: {

  }
}
