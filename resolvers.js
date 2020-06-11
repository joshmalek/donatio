import Medal from './schemas/medal.schema'
import User from './schemas/user.schema'

export const resolvers = {
  Query: {
    getUser: async (_, {id}) => {
      const user = await User.findById(id);
      return user.toObject();
    }
  }

}
