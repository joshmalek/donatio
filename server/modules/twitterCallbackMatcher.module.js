

let twitter_auth_queue = {}
const has = Object.prototype.hasOwnProperty;

const timerInstance = async (instance_token, wait_time) => {
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            // check in twitter_auth_queue for instance_token if
            // the status is no longer pending.
            if (!has.call(twitter_auth_queue, instance_token))  {
                resolve({status: 'error', error: 'Instance token no longer exists.'})
            }
            else {
                let status_ = twitter_auth_queue[instance_token].status
                if (status_ == 'success') {
                    resolve({
                        status: 'success',
                        access_token: twitter_auth_queue[instance_token].access_token,
                        access_token_secret: twitter_auth_queue[instance_token].access_token_secret
                    })
                }
                else {
                    resolve({
                        status: 'error',
                        error: 'Undefined case.'
                    })
                }
            }

        }, wait_time)
    })
}

const monitorQueue = async (time_limit, check_interval, instance_token) => {
    // monitor twitter_auth_queue until its status is complete
    // then return the access_token and access_token_secret.
    // If the time limit runs out, then return an error

    return new Promise(async (resolve, reject) => {

        if (check_interval > time_limit) return {status: 'error', error: 'Invalid check interval'}
        let checks = Math.ceil(time_limit / check_interval)
        let twitter_response = null

        while ((twitter_response == null || twitter_response.status == 'error') && checks > 0) {
            twitter_response = await timerInstance (instance_token, check_interval)
            // console.log(`Timer Response: ${twitter_response}`)
            --checks;
        }

        // now, the time limit has been reached, and the value needs to be returned.
        resolve(twitter_response)

    })
}

const twitterCallbackResponse = (instance_oauth_token, access_token, access_token_secret) => {

    console.log(`Resolving callback for token (${instance_oauth_token})`)

    if (!has.call(twitter_auth_queue, instance_oauth_token)) {
        console.log(`Twitter Callback Response could not find queue in request for ip ${ip}`)
        return
    }

    twitter_auth_queue[instance_oauth_token].onComplete (access_token, access_token_secret)
    // change the status and store the data
    twitter_auth_queue[instance_oauth_token].status = 'success'
    twitter_auth_queue[instance_oauth_token].access_token = access_token
    twitter_auth_queue[instance_oauth_token].access_token_secret = access_token_secret

}

const twitterCallbackInitiate = async ({ oauth_token }) => {

    console.log(`Twitter callback for token (${oauth_token}) initiated...`)

    twitter_auth_queue[oauth_token] = {
        onComplete: (access_token, access_token_secret) => {
            console.log(`OAuth callback returned with values:`)
            console.log(`access_token = ${ access_token}`)
            console.log(`access_token_scret = ${access_token_secret}`)
        },
        status: "pending"
    }

    // Wait here until a response is given by twittercallbackResponse or until
    // time run out (let's give time limit, 30 seconds)
    // let twitter_data = await monitorQueue(30000, 1000, oauth_token)
    // console.log(`Twitter data retrieved: `)
    // console.log(twitter_data)
}

const twitterCallbackMonitor = async (oauth_token) => {
    return new Promise(async (resolve, reject) => {
        console.log(`Monitoring Twitter callback for token (${oauth_token})`)
    
        let twitter_data = await monitorQueue(30000, 1000, oauth_token)
        console.log(`Twitter data retrieved: `)
        console.log(twitter_data)

        resolve (twitter_data)
    })
}

export { twitterCallbackMonitor, twitterCallbackInitiate, twitterCallbackResponse }