import cron from "cron";
import axios from "axios";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const getReceipts = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("https://3.21.56.172/graphql?query={receipts{amount,date_time}}")
      .then((res) => {
        resolve(res.data.data.receipts);
      })
      .catch((err) => {
        resolve(null);
      });
  });
};

const getNPOofDay = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("https://3.21.56.172/graphql?query={NPOofDay{name,_id,at}}")
      .then((res) => {
        resolve(res.data.data.NPOofDay);
      })
      .catch((err) => {
        resolve(null);
      });
  });
};

const getAllNPOs = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("https://3.21.56.172/graphql?query={nonprofits{name,_id,total,at}}")
      .then((res) => {
        resolve(res.data.data.nonprofits);
      })
      .catch((err) => {
        resolve(null);
      });
  });
};


const updateNPOTotal = async (_id, day_sum) => {
  return new Promise((resolve, reject) => {
    axios
      .post("https://3.21.56.172/graphql", {
        query: `mutation {updateNonprofitTotal(_id: "${_id}",sum_donated: ${day_sum}) {name,total}}`
      })
      .then((res) => {
        resolve(res.data.data.updateNonprofitTotal);
      })
      .catch((err) => {
        console.log(err);
        resolve(null);
      });
  });
};
const updateNPOofDay = async (old_id, new_id) => {
  return new Promise((resolve, reject) => {
    axios
      .post("https://3.21.56.172/graphql", {
        query: `mutation {setNPOofDay(old_npo_id: "${old_id}",new_npo_id: "${new_id}") {name,total}}`
      })
      .then((res) => {
        resolve(res.data.data.setNPOofDay);
      })
      .catch((err) => {
        console.log(err);
        resolve(null);
      });
  });
};



//run everyday at 12 pm UTC
const dailyNonprofitSelection = new cron.CronJob("0 0 * * *", async () => {
  var Twitter = require("twitter");
  var client = new Twitter({
    consumer_key: process.env.DONATIO_CONSUMER_KEY,
    consumer_secret: process.env.DONATIO_CONSUMER_SECRET,
    access_token_key: process.env.DONATIO_ACCESS_TOKEN,
    access_token_secret: process.env.DONATIO_ACCESS_TOKEN_SECRET,
  });

  console.log("running npo selection\n");

  let previous_npo = await getNPOofDay();
  console.log("current npo = " + previous_npo.name);
  let receipts = await getReceipts();


  var today = new Date();
  var yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  //Date.parse converts to int format
  today.toDateString();
  today = Date.parse(today);
  yesterday.toDateString();
  yesterday = Date.parse(yesterday);
  var total_donations_today = 0;
  for (var i = 0; i < receipts.length; i++) {
    var parsed_date = Date.parse(receipts[i].date_time);
    //for each receipt, see if it falls between today and yesterday at the time the cron job is run (5pm)
    if (parsed_date > yesterday && parsed_date < today) {
      //console.log(receipts[i].date_time + " " + receipts[i].amount);
      total_donations_today += receipts[i].amount;
    }
  }
  total_donations_today = total_donations_today.toFixed(2);
  console.log("Amount to be added to total nonprofit givings: " + total_donations_today);
  console.log("Will add " + total_donations_today + " to " + previous_npo.name);
  //update NPOofDay amount
  let response = await updateNPOTotal(previous_npo._id, total_donations_today);
  console.log("Added to total donations");
  let nonprofits = await getAllNPOs();
  var npo_list = [];
  console.log("looking for least total donation NPO")
  for (var i = 0; i < nonprofits.length; i++) {
    if (nonprofits[i]._id != previous_npo._id) {
      npo_list.push([nonprofits[i].total, nonprofits[i]._id, nonprofits[i].name, nonprofits[i].at]);
    }

  }
  //pull all NPOs and sort by lowest
  var sorted_npo_list = npo_list.sort(function (a, b) { return a[0] - b[0]; });
  //console.log(sorted_npo_list)
  console.log("lowest value npo was found to be " + sorted_npo_list[0][2] + ", setting to npoOfDay");
  //change npo of day to be lowest 
  let update_response = await updateNPOofDay(previous_npo._id, sorted_npo_list[0][1])
  console.log("set npo of day successfully");
  //finish
  console.log("Tweeting our daily donation totals\n");

  //tweet structure

  client.post(
    "statuses/update",
    {
      status:
        "Today DonatIO users donated $" +
        total_donations_today +
        " to " +
        previous_npo.at +
        "!  Thank you to everyone who donated. Our new #NonprofitOfTheDay will be " +
        sorted_npo_list[0][3] +
        ".  Let's help them out!",
    },
    function (error, tweet, response) {
      if (!error) {
        console.log("Tweet successfully posted\n");
      } else {
        console.log(error);
      }
    }
  );
});


export { dailyNonprofitSelection };
