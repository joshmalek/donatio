import cron from 'cron'
import axios from 'axios'

//run everyday at 4:59 pm
const dailyNonprofitSelection = new cron.CronJob('59 16 * * *', () => {
  console.log(`\nDailyNonprofitSelection Cron Job Running`)
  let start_time = new Date ()
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
  console.log("Tweeting our daily donation totals\n");

  //change this to retrieve npo of day, new npo, and
  axios.post(url,{
    query: '{nonprofits{name,priority,id}}'
  })
  .then(res => {
    let nonprofits = res.data.data.nonprofits
    //retrieve nonprofit of the day
    //tweet structure
    console.log("Today DonatIO users donated ${total} to {NPOofDay}!  Thank you to everyone who donated.")
    console.log("Our new nonprofit will be {new_npoOfDay}.  Let's help them out!")
  })
  .catch(err => {
    console.log('Error fetching nonprofits...')
    console.log(err)
  })
})
export { dailyNonprofitSelection }
