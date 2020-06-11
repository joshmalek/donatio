import Medal from './schemas/medal.schema'
import User from './schemas/user.schema'
import NPO from './schemas/npo.schema'

export const resolvers = {
  Query: {
    getUserById: async (_, {id}) => {
      const user = await User.findById(id);
      return user.toObject();
    }
  }

}
