import cron from 'cron'
import axios from 'axios'



//run everyday at 4:59 pm
const dailyNonprofitSelection = new cron.CronJob('59 16 * * *', () => {
  console.log(`\nDailyNonprofitSelection Cron Job Running`)
  let start_time = new Date()
  console.log(`${start_time.getMonth() + 1}/${start_time.getDay()}/${start_time.getFullYear()}`)
  var url = 'http://localhost:4000/graphql';
  axios.post(url, {
    query: '{ nonprofits { name, priority, id } }'
  })
    .then(res => {
      let nonprofits = res.data.data.nonprofits
      // let
    })
    .catch(err => {
      console.log(`Error fetching nonprofits...`)
      console.log(err)
    })



})

//tweet every day at 5pm how much was donated to the nonprofit of the day
const dailyDonationTweet = new cron.CronJob('0 17 * * *', () => {

  var Twitter = require('twitter');
  var client = new Twitter({
    consumer_key: process.env.DONATIO_CONSUMER_KEY,
    consumer_secret: process.env.DONATIO_CONSUMER_SECRET,
    access_token_key: process.env.DONATIO_ACCESS_TOKEN,
    access_token_secret: process.env.DONATIO_ACCESS_TOKEN_SECRET
  });

  console.log("Tweeting our daily donation totals\n");

  axios.get('http://localhost:4000/graphql?query={receipts{amount,date_time}}')
    .then(res => {
      let receipts = res.data.data.receipts
      var today = new Date()
      var yesterday = new Date(today)

      yesterday.setDate(yesterday.getDate() - 1)

      //Date.parse converts to int format
      today.toDateString()
      today = Date.parse(today)
      yesterday.toDateString()
      yesterday = Date.parse(yesterday)
      var total_donations_today = 0;
      for (var i = 0; i < receipts.length; i++) {
        var parsed_date = Date.parse(receipts[i].date_time);
        //for each receipt, see if it falls between today and yesterday at the time the cron job is run (5pm)
        if (parsed_date > yesterday && parsed_date < today) {
          console.log(receipts[i].date_time + " " + receipts[i].amount);
          total_donations_today += receipts[i].amount;
        }
        else {
          console.log("NOT IN TIMESPAN " + receipts[i].date_time + " " + receipts[i].amount);
        }
      }
      //retrieve nonprofit of the day
      axios.get('http://localhost:4000/graphql?query={NPOofDay{name}}')
        .then(res => {
          var npo = res.data.data.NPOofDay.name;
          console.log("total donated to " + npo + " = " + total_donations_today);

          //tweet structure
          client.post('statuses/update', { status: "Today DonatIO users donated $" + total_donations_today + " to " + npo + "!  Thank you to everyone who donated. Our new nonprofit will be " + npo + ".  Let's help them out!" }, function (error, tweet, response) {
            if (!error) {
              console.log("Tweet successfully posted\n");
            }
            else {
              console.log(error);
            }
          });
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log('Error fetching receipts...')
      console.log(err)
    })
})
export { dailyNonprofitSelection, dailyDonationTweet }
