import cron from "cron";
import axios from "axios";

const getReceipts = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:4000/graphql?query={receipts{amount,date_time}}")
      .then((res) => {
        resolve(res.data.data.receipts);
      })
      .catch((err) => {
        resolve(null);
      });
  });
};

const getNPO = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:4000/graphql?query={NPOofDay{name}}")
      .then((res) => {
        resolve(res.data.data.NPOofDay.name);
      })
      .catch((err) => {
        resolve(null);
      });
  });
};


var previous_npo = null;
//run everyday at 4:59 pm
const dailyNonprofitSelection = new cron.CronJob("59 16 * * *", () => {
  let previous_npo = await getNPO();
  let todays_receipts = await getReceipts();





});



//tweet every day at 5pm how much was donated to the nonprofit of the day
const dailyDonationTweet = new cron.CronJob("0 17 * * *", async () => {
  var Twitter = require("twitter");
  var client = new Twitter({
    consumer_key: process.env.DONATIO_CONSUMER_KEY,
    consumer_secret: process.env.DONATIO_CONSUMER_SECRET,
    access_token_key: process.env.DONATIO_ACCESS_TOKEN,
    access_token_secret: process.env.DONATIO_ACCESS_TOKEN_SECRET,
  });

  console.log("Tweeting our daily donation totals\n");

  let receipts = await getReceipts();
  let npo = await getNPO();

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
      console.log(receipts[i].date_time + " " + receipts[i].amount);
      total_donations_today += receipts[i].amount;
    } else {
      console.log(
        "NOT IN TIMESPAN " +
        receipts[i].date_time +
        " " +
        receipts[i].amount
      );
    }
  }
  console.log(
    "total donated to " + npo + " = " + total_donations_today
  );

  //tweet structure
  client.post(
    "statuses/update",
    {
      status:
        "Today DonatIO users donated $" +
        total_donations_today +
        " to " +
        npo +
        "!  Thank you to everyone who donated. Our new nonprofit will be " +
        npo +
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


export { dailyNonprofitSelection, dailyDonationTweet };
