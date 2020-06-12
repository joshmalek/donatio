import Medal from './schemas/medal.schema'
import User from './schemas/user.schema'
import Nonprofit from './schemas/nonprofit.schema'

export const resolvers = {
  Query: {
    user: async (_, {_id}) => {
      const user = await User.findById(_id);
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
    },
    updateNonprofitPriority: async (_, {_id}) => {

      let nonprofit = await Nonprofit.findById(_id)
      nonprofit.priority = nonprofit.priority + 1
      nonprofit = await nonprofit.save ()
      return nonprofit.toObject ()

    }
  }

}
