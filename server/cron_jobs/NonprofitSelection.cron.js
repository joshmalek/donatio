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

  //change this to retrieve npo of day, new npo, and
  axios.post(url, {
    query: '{receipts{name,priority,id}}'
  })
    .then(res => {
      let nonprofits = res.data.data.nonprofits
      //retrieve nonprofit of the day
      //tweet structure
      client.post('statuses/update', { status: "Today DonatIO users donated ${total} to {NPOofDay}!  Thank you to everyone who donated.\nOur new nonprofit will be {new_npoOfDay}.  Let's help them out!" }, function (error, tweet, response) {
        if (!error) {
          console.log(tweet);
        }
      });

    })
    .catch(err => {
      console.log('Error fetching nonprofits...')
      console.log(err)
    })







})
export { dailyNonprofitSelection }
