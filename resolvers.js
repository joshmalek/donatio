import Medal from './schemas/medal.schema'
import User from './schemas/user.schema'
import Nonprofit from './schemas/nonprofit.schema'

export const resolvers = {
  Query: {
    user: async (_, {id}) => {
      const user = await User.findById(id);
      return user.toObject();
    },
    nonprofits: async () => {
      const nonprofits = await Nonprofit.find()
      return nonprofits
    }
  },

  Mutation: {
    addNonprofit: async (_, {vendor_id, vendor_organization_reference, name}) => {

      let new_nonprofit = new Nonprofit({
        vendor_id,
        vendor_organization_reference,
        name,
        priority: 0
      })

      let result = await new_nonprofit.save ()
      return result.toObject ()
    }
  }

}
