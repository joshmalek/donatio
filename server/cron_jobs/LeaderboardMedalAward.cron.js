import cron from "cron";
import axios from "axios";

import CalculateUserPoints from "../modules/userPoints.module"
import { hash } from "bcrypt";

const FetchLeaderboard = async (limit, offset) => {

    return new Promise ((resolve, reject) => {

        axios.get(`${process.env.TARGET_API_URL}?query={leaderboard(offset:${offset},limit:${limit}){firstName, lastName, _id, medals { _id, name, process_func } }}`)
        .then(res => {
            resolve(res.data.data.leaderboard)
        })
        .catch(err => {
            resolve(err);
        })

    });
}

const LeaderboardMedalCron = async () => {

    // load 10 users at a time until all the users in the database
    // have been loaded.
    // Keep track of the top 4 users for the week in terms of points
    // and, after all the users have been queries, award the top 4
    // users the leaderboard award, if they do not yet have one.

    let leaderboard_top = []

    let fetched_ = [];
    let _offset = 0;
    do {
        fetched_ = await FetchLeaderboard(10, _offset);
        _offset += 10;

        // check through the fetched and update the leaderboard top 4
        let fetched_points = [];
        fetched_.forEach(fetched_user => {
            fetched_points.push( CalculateUserPoints({user_id: fetched_user._id}) )
        })

        let user_points = await Promise.all(fetched_points);
        // compare each user to the entries in fetched_.

        let users_with_points = fetched_.map((user_, p) => {

            return {
                user: user_,
                points: user_points[p]
            }

        })
        users_with_points.sort((a, b) => a.points > b.points ? 1 : -1)
        users_with_points = users_with_points.slice(0, 4)

        // Now, users_with_points has the top 4 users for the current
        // batch of fetched
        if (leaderboard_top.length == 0) {
            // assume if leaderboard_top == 0, this is the first batch.
            leaderboard_top = users_with_points
        }
        else {
            // Otherwise, we need to look at the top 4 we have
            // collected from this batch, and compare them with
            // the top 4 stored so far, and see if any of our 
            // top 4 beat the current set top 4.

            leaderboard_top = [...leaderboard_top, ...users_with_points]
            leaderboard_top.sort((a, b) => a.points > b.points ? 1 : -1)
            leaderboard_top = leaderboard_top.slice(0, 4)
        }


    } while(fetched_.length > 0);

    // at the end, the users need to be awarded with their medals!!
    console.log(`Top 4 Users of the Week!`)
    console.log(leaderboard_top)

    let award_id = ["5f11f71f6b49ac531d69c8c4", "5f11f76e6b49ac531d69c8c5", "5f11f7876b49ac531d69c8c6", "5f11f79f6b49ac531d69c8c7"]
    for (var i = 0; i < leaderboard_top.length; ++i) {
        if (hasMedal(leaderboard_top[i].user.medals, award_id[i])) {
            console.log(`User ${leaderboard_top[i].user._id} already has award ${award_id[i]}`)
        }
        else {
            console.log(`User ${leaderboard_top[i].user._id} has been awarded with medal ${award_id[i]}`)
            // TODO actually award the user now ...
        }
    }

}

const hasMedal = (user_medals, medal_id) => {
    for (var i = 0; i < user_medals.length; ++i) {
        if (user_medals._id == medal_id) return true;
    }
    return false;
}

export default LeaderboardMedalCron;