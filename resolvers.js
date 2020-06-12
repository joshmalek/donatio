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
    },
    NPOofDay: async () => {

      // npo of the day is stored in document with id: 5ee31d9b19a821c0a63b094b
      let npo_info = await Nonprofit.findById('5ee31d9b19a821c0a63b094b')
      let selected_nonprofit = await Nonprofit.findById(npo_info.npo_id)
      return selected_nonprofit.toObject()
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

    },
    setNPOofDay: async (_, {_id}) => {

      let new_npoOfDay = await Nonprofit.findById(_id)
      if (!new_npoOfDay) return null

      let npo_info = await Nonprofit.findById('5ee31d9b19a821c0a63b094b')
      npo_info.npo_id = _id
      npo_info = await npo_info.save ()
      console.log(npo_info)

      return new_npoOfDay.toObject ()

    }
  }

}
