import cron from 'cron'
import axios from 'axios'

//run everyday at midnight
const dailyNonprofitSelection = new cron.CronJob('0 0 * * *', () => {
  console.log(`\nDailyNonprofitSelection Cron Job Running`)
  let start_time = new Date ()
  console.log(`${start_time.getMonth() + 1}/${start_time.getDay()}/${start_time.getFullYear()}`)

  axios.post('http://localhost:4000/graphql', {
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

  axios.post('http://localhost:4000/graphql',{
    query: '{nonprofits{name,priority,id}}'
  })
  .then(res => {
    let nonprofits = res.data.data.nonprofits
    //retrieve nonprofit of the day
    //tweet structure
    //  Today DonatIO users donated ${total} to {NPOofDay}!  Thank you to everyone who donated.
    //  Our new nonprofit will be {new_npoOfDay}.  Let's help them out! 
  })
  .catch(err => {
    console.log('Error fetching nonprofits...')
    console.log(err)
  })
})
export { dailyNonprofitSelection }
