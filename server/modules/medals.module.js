// Medals Module -> Determine which medals a user earns, given their past
// information and their updated information

import axios from "axios";
import MedalAPI from "../API/medals.api";
import { STRING_REFS } from "../string.refs";

let medals_;
const setupMedals = async () => {
  return MedalAPI.getMedals()
    .then((response) => {
      medals_ = response;
      if (medals_) {
        console.log(`Medal setup complete!`);
        console.log(medals_);
      } else {
        throw new Error(response.status);
      }
    })
    .catch((err) => {
      console.log(`Error in setupMedals ()`);
      console.log(err);
    });
};

setupMedals();

//=========================================================================

const rewardMedal = (process_func) => {
  let reward_ = null;
  medals_.forEach((medal) => {
    if (medal.process_func == process_func) {
      reward_ = { ...medal._doc };
    }
  });
  return reward_;
};

const hasMedal = (medals_arr, medal) => {
  console.log(`In hasMedal...`);

  for (let medal_index in medals_arr) {
    let user_medal = medals_arr[medal_index];
    if (user_medal._id.equals(medal._id)) {
      return true;
    }
  }
  return false;
};

const processMedals = (user_data, normalized_donation_amount) => {
  let medals_earned = [];
  console.log(`Processing Medals`);
  console.log(user_data);
  medals_.forEach((medal) => {
    let process_func = medal.process_func;
    console.log(`Checking medal: ${medal.name} => ${process_func}`);
    if (!hasMedal(user_data.medals, medal)) {
      let medal_response = _process[process_func](
        user_data,
        normalized_donation_amount
      );

      if (medal_response) medals_earned.push(medal_response);
    }
  });

  console.log(`Medals Earned`);
  console.log(medals_earned);
  return medals_earned;
};

// This is where we determine which awards to give a user after each donation.
// The key of the _process corresponds to the process_func field value of the medal
// in the database.
//
// If the user meets the defined criterion, they will be given the award.

const _process = {
  _first_donation: (user_data, normalized_donation_amount) => {
    if (user_data.total_donated == 0) return rewardMedal("_first_donation");
  },
  _milestone_one: (user_data, normalized_donation_amount) => {
    if (user_data.total_donated + normalized_donation_amount >= 5)
      return rewardMedal("_milestone_one");
  },
  _milestone_two: (user_data, normalized_donation_amount) => {
    if (user_data.total_donated + normalized_donation_amount >= 10)
      return rewardMedal("_milestone_two");
  },
  _milestone_three: (user_data, normalized_donation_amount) => {
    if (user_data.total_donated + normalized_donation_amount >= 20)
      return rewardMedal("_milestone_three");
  },
  _milestone_four: (user_data, normalized_donation_amount) => {
    if (user_data.total_donated + normalized_donation_amount >= 40)
      return rewardMedal("_milestone_four");
  },
};

export { processMedals };
