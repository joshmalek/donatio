// Medals Module -> Determine which medals a user earns, given their past
// information and their updated information

import axios from 'axios'
import { STRING_REFS } from '../string.refs'

let medals_
const setupMedals = async () => {
    return axios.post(STRING_REFS.API_URL, {
        'query': `{ medals { name, description, img_url, process_func, _id } }`
    })
}

setupMedals ()
.catch(err => {
    console.log(`[module:medals] Problem setting up Medals module.`)
})
.then(response => {
    //response comes back clean
    //console.log(`Medals Module Response`)
    medals_ = response.data.data.medals
    //console.log(medals_)
})

//=========================================================================

const rewardMedal = (process_func) => {
    let reward_ = null
    medals_.forEach(medal => {

        if (medal.process_func == process_func) {
            reward_ = { ...medal }
        }
    })
    return reward_
}

const hasMedal = (medals_arr, medal) => {
    console.log(`In hasMedal...`)

    for (let medal_index in medals_arr) {
        let user_medal = medals_arr[medal_index]
        if (user_medal._id.equals(medal._id)) {
            return true
        }
    }
    return false
}

const processMedals = (user_data, normalized_donation_amount) => {
    
    let medals_earned = []
    console.log(`Processing Medals`)
    console.log(user_data)
    medals_.forEach(medal => {

        let process_func = medal.process_func
        console.log(`Checking medal: ${medal.name} => ${process_func}`)
        if (!hasMedal(user_data.medals, medal)) {
            let medal_response = _process[process_func](user_data, normalized_donation_amount)

        if (medal_response) medals_earned.push(medal_response)
        }
    })

    console.log(`Medals Earned`)
    console.log(medals_earned)
    return medals_earned
}

const _process = {
    _first_donation: (user_data, normalized_donation_amount) => {
        // Determine whether the user earns their first donation
        // medal.
        console.log(`Processing first donation!`)

        console.log(`First donation ? ${user_data.total_donated == 0}`)
        if (user_data.total_donated == 0) return rewardMedal('_first_donation')

    }
}

export { processMedals }