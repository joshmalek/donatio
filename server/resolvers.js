import Medal from './schemas/medal.schema'
import User from './schemas/user.schema'
import Nonprofit from './schemas/nonprofit.schema'
import { processMedals } from './modules/medals.module'

import MedalAPI from './API/medals.api'

export const resolvers = {
  Query: {
    user: async (_, {_id}) => {
      const user = await User.findById(_id);
      return user.toObject();
    },
    nonprofits: async () => {
      const nonprofits = await Nonprofit.find({ _id: { "$ne" : "5ee31d9b19a821c0a63b094b" } })
      return nonprofits
    },
    NPOofDay: async () => {

      // npo of the day is stored in document with id: 5ee31d9b19a821c0a63b094b
      let npo_info = await Nonprofit.findById('5ee31d9b19a821c0a63b094b')
      let selected_nonprofit = await Nonprofit.findById(npo_info.npo_id)
      return selected_nonprofit.toObject()
    },
    medals: async () => {
      return MedalAPI.getMedals ()
      // return await Medal.find()
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

      // update the priority of the npo of day
      new_npoOfDay.priority = new_npoOfDay.priority + 1
      new_npoOfDay = await new_npoOfDay.save()

      return new_npoOfDay.toObject ()

    },

    processDonation: async (_, { user_id, donation_amount, currency_code }) => {

      let user = await User.findById(user_id)
      if (!user) {
        console.log(`User ${user_id} does not exist.`)
        return null
      }

      let usd_donation_amount =  donation_amount // TODO manage currency exchange value to be uniform
      let _total_donated = user.total_donated + usd_donation_amount
      
      // process the medals that the user unlocks
      let medals_earned = processMedals(user, usd_donation_amount)

      // add the medals to the user's array of medals earned
      user.medals = [...user.medals, ...medals_earned]

      let donation_reward = {
        previous_experience_value: user.experience,
        experience_gained: calculateExperienceGained(usd_donation_amount),
        total_donation: _total_donated,
        medals_unlocked: medals_earned
      }

      // add the donation amount the the user
      user.total_donated = _total_donated
      user.experience = user.experience + donation_reward.experience_gained
      console.log(user)
      user.save ()

      console.log(`Donation reward`)
      console.log(donation_reward)

      return donation_reward

    }
  }

}

const  pad = (d, amount) => {
  let pad_min = Math.pow(10, amount) / 10
  return (d < pad_min) ? '0' + d.toString() : d.toString();
}

const calculateExperienceGained = (donation_amount) => {
  return 10 * donation_amount
}