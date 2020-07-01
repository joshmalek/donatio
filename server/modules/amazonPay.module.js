import axios from "axios";
import QueryString from "query-string";
import urlencode from "urlencode";
import execSh from "exec-sh";

const AmazonPayAPI = {
  SetOrderReferenceDetails: async (
    donation_amount,
    currency_code,
    order_ref_id
  ) => {
    console.log(`Set Order Reference Details called`);

    // Python API Args:
    // api_name, aws_access_key_id, aws_access_key_secret, merchant_id, region, currency_code, order_ref_id,
    // order_total

    let order_success = false;

    let args =
      `SET_ORDER_ATTRIBUTES ${process.env.AMAZON_ACCESS_ID} ${process.env.AMAZON_ACCESS_KEY_SECRET} ${process.env.AMAZON_SELLER_ID} ` +
      `na ${currency_code} ${order_ref_id} ${donation_amount}`;
    console.log(`Args: ${args}`);
    execSh(
      `python server/python_modules/amazonPayAPI.py ${args}`,
      true,
      (err, stdout, stderr) => {
        if (err) {
          //   return false;
          order_success = false;
        } else {
          order_success = true;
        }
      }
    );

    return order_success;
  },
};

export default AmazonPayAPI;
