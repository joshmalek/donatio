import cron from 'cron'
import axios from 'axios'

const dailyNonprofitSelection = new cron.CronJob('* * * 1 * *', () => {
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

export { dailyNonprofitSelection }
