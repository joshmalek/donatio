import TwitterLite from "twitter-lite";
import Twitter from "twitter";
import axios from "axios";
import qs from "qs";
import randomstring from "randomstring";
import sendmail from "sendmail";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

import Receipt from "./schemas/receipt.schema";
import Medal from "./schemas/medal.schema";
import User from "./schemas/user.schema";
import Nonprofit from "./schemas/nonprofit.schema";
import { processMedals } from "./modules/medals.module";
import {
  twitterCallbackMonitor,
  twitterCallbackInitiate,
  twitterCallbackResponse,
} from "./modules/twitterCallbackMatcher.module";
import AmazonPayAPI from "./modules/amazonPay.module";

import MedalAPI from "./API/medals.api";

const twitterLiteClient = new TwitterLite({
  consumer_key: "ElvTnb0OJ3J9DSF9cCI3HZXTl",
  consumer_secret: "807do5gaUWt4q5WPZH4pvPOyGczFtyzRoEktlSbiJ0lFqSXcNM",
});

const verifyTwitterCreds = (oauth_token, oauth_verifier) => {
  return axios({
    method: "POST",
    url: "https://api.twitter.com/oauth/access_token",
    data: qs.stringify({
      oauth_consumer_key: process.env.TWITTER_CONSUMER_KEY, // TODO HIDE THIS!
      oauth_token,
      oauth_verifier,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  })
    .then((res) => {
      console.log(`Twitter API:`);
      return res.data;
    })
    .catch((err) => {
      console.log(`Twitter API Error:`);
      console.log(err);
    });
};

export const resolvers = {
  Query: {
    user: async (_, { _id }) => {
      const user = await User.findById(_id);
      return user.toObject();
    },
    users: async () => {
      const users = await User.find();
      return users;
    },
    nonprofits: async () => {
      const nonprofits = await Nonprofit.find();
      return nonprofits;
    },
    NPOofDay: async () => {
      // npo of the day is stored in document with id: 5efa4e0f83d4c7657784589a
      let npo_of_day = await Nonprofit.find({ is_NPOofDay: true });
      return npo_of_day[0].toObject();
    },
    medals: async () => {
      return MedalAPI.getMedals();
      // return await Medal.find()
    },
    initiateTwitterAuth: async (_, __, ctx) => {
      let auth_response = await twitterLiteClient.getRequestToken(
        "https://donatio-site.herokuapp.com/twitter"
      );
      console.log(auth_response);
      twitterCallbackInitiate(auth_response);

      return {
        oauth_token: auth_response.oauth_token,
        oauth_token_secret: auth_response.oauth_token_secret,
      };
    },
    receipts: async () => {
      const receipts = await Receipt.find();
      return receipts;
    },
    weekReceipts: async (_, { user_id }) => {
      let week_start = new Date();
      week_start.setDate(week_start.getDate() - week_start.getDay());
      week_start.setHours(0, 0, 0);

      let user_receipts = await Receipt.find({
        user_id: user_id,
        date_time: { $gt: week_start },
      });

      return user_receipts.map((receipt_) => {
        receipt_.iso_dateTime = new Date(receipt_.date_time).toISOString();
        return receipt_;
      });
    },
    userLockedMedals: async (_, { _id }) => {
      // Find the medals that the user with id= _id has not unlocked yet
      let user = await User.findById(_id);
      if (!user) {
        return [];
      }

      let user_medals = user.medals;
      let all_medals = await MedalAPI.getMedals();

      return all_medals.filter((medal_) => {
        // only accept the medals that are not in user_medals
        for (let i in user_medals) {
          if (user_medals[i]._id.equals(medal_._id)) {
            return false;
          }
        }
        return true;
      });
    },
    monitorTwitterAuth: async (_, { oauth_token }) => {
      // This call should manage twitterCallback and wait for a response,
      // or timeout when the time limit has been reached

      let twitter_data = await twitterCallbackMonitor(oauth_token);
      console.log(`Monitor response:`);
      console.log(twitter_data);

      return {
        oauth_token: twitter_data.access_token,
        oauth_token_secret: twitter_data.access_token_secret,
      };
    },
    processTwitterAuth: async (_, { oauth_token, oauth_verifier }) => {
      console.log(`ProcessTwiterAuth: ${oauth_token}, ${oauth_verifier}`);
      let response = await verifyTwitterCreds(oauth_token, oauth_verifier);
      let parsed_response = qs.parse(response);

      console.log(`process twitter auth response...`);
      console.log(parsed_response);

      // pass parsed response to twitterCallbackResponse
      twitterCallbackResponse(
        oauth_token,
        parsed_response.oauth_token,
        parsed_response.oauth_token_secret
      );

      return true;
      // return {
      //   oauth_token: parsed_response.oauth_token,
      //   oauth_token_secret: parsed_response.oauth_token_secret
      // }
    },
    sendTweet: async (_, { access_token, access_token_secret, tweet }) => {
      const twitterClient = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: access_token,
        access_token_secret: access_token_secret,
      });

      twitterClient.post("statuses/update", {
        status: tweet,
      });

      return true;
    },
    requestAmazonCreds: async (_, { access_token }) => {
      let response = await AmazonPayAPI.RequestUserData(access_token);

      if (response) {
        // Check if a user with this email exists on our platform. If so, then
        // this is the user that will recieve the donation points.
        // Otherwise, create the new user.

        let user_result = await User.findOne({ email: response.email });

        if (!user_result) {
          // create the user
          let middle_index = response.name.indexOf(" ");
          let firstName = response.name.substring(0, middle_index);
          let lastName = response.name.substring(middle_index);
          console.log(firstName);
          console.log(lastName);
          let new_user = new User({
            firstName,
            lastName,
            email: response.email,
            experience: 0,
            medals: [],
            total_donated: 0,
            email_confirmed: false,
          });
          user_result = await new_user.save();
        }

        return {
          email: response.email,
          first_name: user_result.firstName,
          last_name: user_result.lastName,
          user_id: user_result._id,
        };
      }

      // default return
      return response;
    },
    checkConfirmation: async (_, { confirmation_key }) => {
      let user = await User.findOne({ confirmation_string: confirmation_key });
      return user;
    },
  },

  Mutation: {
    login: async (_, { email, password }) => {
      console.log(`Login initiated`);
      let user_ = await User.findOne({ email: email });
      if (!user_) return null;

      // compare the password
      let passwordMatch = await comparePasswords(password, user_.password);
      if (passwordMatch) return user_;
      return null;
    },
    setUserPassword: async (_, { user_id, password }) => {
      let user = await User.findById(user_id);
      if (!user) return false;

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          // hashing password
          user.password = hash;
          user.save();
        });
      });
      user.save();

      return true;
    },
    setEmailConfirmed: async (_, { user_id }) => {
      let user = await User.findById(user_id);
      if (!user) return false;

      user.email_confirmed = true;
      user.confirmation_string = undefined;
      user.save();

      return true;
    },
    addNonprofit: async (
      _,
      { vendor_id, vendor_organization_reference, name }
    ) => {
      let new_nonprofit = new Nonprofit({
        vendor_id,
        vendor_organization_reference,
        name,
        priority: 0,
      });

      let result = await new_nonprofit.save();
      return result.toObject();
    },
    updateNonprofitTotal: async (_, { _id, sum_donated }) => {
      let nonprofit = await Nonprofit.findById(_id);
      if (nonprofit.total == null) {
        nonprofit.total = sum_donated;
      } else {
        nonprofit.total = nonprofit.total + sum_donated;
      }
      nonprofit = await nonprofit.save();
      return nonprofit.toObject();
    },
    setNPOofDay: async (_, { old_npo_id, new_npo_id }) => {
      let new_npoOfDay = await Nonprofit.findById(new_npo_id);
      let old_npoOfDay = await Nonprofit.findById(old_npo_id);

      old_npoOfDay.is_NPOofDay = false;
      new_npoOfDay.is_NPOofDay = true;
      old_npoOfDay = await old_npoOfDay.save();
      new_npoOfDay = await new_npoOfDay.save();
      return new_npoOfDay.toObject();
    },
    processDonation: async (_, { receipt_id }) => {
      // 1. Find the receipt that.
      console.log("Processing Donation");
      let receipt = await Receipt.findById(receipt_id);
      if (!receipt || receipt.claimed) {
        // receipt does not exist.
        return null;
      }

      console.log("Receipt Info:");
      console.log(receipt);

      let user = await User.findById(receipt.user_id);
      if (!user) {
        console.log(`User ${receipt.user_id} does not exist.`);
        return null;
      }

      let usd_donation_amount = receipt.amount; // TODO manage currency exchange value to be uniform
      let _total_donated = user.total_donated + usd_donation_amount;

      // mark the receipt as claimed now
      let now_ = new Date();
      receipt.claimed = true;
      receipt.save();

      // process the medals that the user unlocks
      let medals_earned = processMedals(user, usd_donation_amount);
      medals_earned = medals_earned.map((medal_) => {
        return {
          ...medal_,
          date_awarded: now_.toISOString(),
        };
      });

      // add the medals to the user's array of medals earned
      user.medals = [...user.medals, ...medals_earned];

      let donation_reward = {
        previous_experience_value: user.experience,
        experience_gained: calculateExperienceGained(usd_donation_amount),
        total_donation: _total_donated,
        medals_unlocked: medals_earned,
      };

      // add the donation amount the the user
      user.total_donated = _total_donated;
      user.experience = user.experience + donation_reward.experience_gained;
      console.log(user);
      user.save();

      console.log(`Donation reward`);
      console.log(donation_reward);

      return donation_reward;
    },
    processAmazonPay: async (
      _,
      { donation_amount, currency_code, order_reference_id, user_id }
    ) => {
      let result = await AmazonPayAPI.SetOrderReferenceDetails(
        donation_amount,
        currency_code,
        order_reference_id,
        user_id
      );
      console.log(`THE API RETURNED ${result}`);

      // create donation receipt
      if (result) {
        let now_ = new Date();
        let npo_info = await Nonprofit.findById("5efa4e0f83d4c7657784589a");
        let receipt_ = new Receipt({
          npo_id: npo_info.npo_id,
          user_id: user_id,
          amount: donation_amount,
          date_time: now_,
          claimed: false,
        });
        let donation_receipt = await receipt_.save();

        return {
          success: true,
          receipt_id: donation_receipt._id,
        };
      }

      return { success: result };
    },
    initiateEmailConfirmation: async (_, { user_id }) => {
      // Find the user with user_id and generate a
      // confirmation string
      let user = await User.findById(user_id);
      if (!user) {
        return false;
      }

      // generate a confirmation string
      let confirmation_string = randomstring.generate(64);
      user.confirmation_string = confirmation_string;
      user.save();

      // send the email to the user's email.
      console.log(`Sending email to ${user.email}`);
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      transporter.sendMail(
        {
          from: "no-reply@donatio.com", // process.env.GMAIL_USERNAME,
          to: user.email,
          subject: "Donatio: Confirmation Email",
          text: `Hello ${user.firstName} ${user.lastName}, 
        You're almost done setting up your account!
        Finish the setup by clicking the confirmation link
        below and setup your account's password.
        
        https://donatio-site.herokuapp.com/confirm?confirm_key=${confirmation_string}
        
        Donatio Team`,
        },
        function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        }
      );
      //////
      // let send_ = sendmail();
      // send_(
      //   {
      //     from: "no-reply@donatio.com",
      //     to: user.email,
      //     subject: "Donatio: Confirmation Email",
      //     html: `Hello ${user.firstName} ${user.lastName},
      //     You're almost done setting up your account!
      //     Finish the setup by clicking the confirmation link
      //     below and setup your account's password.

      //     https://donatio-site.herokuapp.com/confirm?confirm_key=${confirmation_string}

      //     Donatio Team`,
      //   },
      //   function (err, reply) {
      //     console.log(err && err.stack);
      //     console.dir(reply);
      //   }
      // );

      return true;
    },
  },
};

const pad = (d, amount) => {
  let pad_min = Math.pow(10, amount) / 10;
  return d < pad_min ? "0" + d.toString() : d.toString();
};

const calculateExperienceGained = (donation_amount) => {
  return 10 * donation_amount;
};

const comparePasswords = async (unhashedPass, hashedPass) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(unhashedPass, hashedPass, function (err, result) {
      // result == true
      resolve(result);
    });
  });
};
