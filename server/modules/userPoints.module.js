
// User Points Module:
// Provide the functions to calculate the points for a user.

import Receipt from "../schemas/receipt.schema"

const EvaluateReceipt = (receipt_doc) => {
    if (!receipt_doc.amount) return 0;
    return receipt_doc.amount * 10;
}

const GetWeekStart = () => {
    let week_start = new Date ();
    week_start.setDate(week_start.getDate() - week_start.getDay());
    week_start.setHours(0, 0, 0, 0);
    return week_start;
}

const CalculateUserPoints = async ({ user_id }) => {

    return new Promise ((resolve, reject) => {

        // 1. Find the receipts for this user.
        Receipt.find({
            user_id: user_id,
            date_time: { $gte: GetWeekStart() },
        }, (err, user_receipts) => {

            if (err || !user_receipts) resolve(0);
            else {
                let points_ = 0;
                for (var i = 0; i < user_receipts.length; ++i) {
                    points_ += EvaluateReceipt( user_receipts[i] );
                }
                resolve(points_);
            }

        })

    });

}

export default CalculateUserPoints
export { GetWeekStart }