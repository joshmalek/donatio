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

    console.log("START");
    let result = await PlaceOrder(donation_amount, currency_code, order_ref_id);
    console.log("END");

    return result;
  },
  RequestUserData: async (access_token) => {
    console.log(`Requesting User Data!`);
    let result = await PythonUserData(access_token);
    return result;
  },
};

const PlaceOrder = async (donation_amount, currency_code, order_ref_id) => {
  return new Promise((resolve, reject) => {
    let args =
      `SET_ORDER_ATTRIBUTES ${process.env.AMAZON_ACCESS_ID} ${process.env.AMAZON_ACCESS_KEY_SECRET} ${process.env.AMAZON_SELLER_ID} ` +
      `na ${currency_code} ${order_ref_id} ${donation_amount}`;
    execSh(
      `python3 server/python_modules/amazonPayAPI.py ${args}`,
      true,
      (err, stdout, stderr) => {
        let order_success = false;
        if (err) {
          //   return false;
          order_success = false;
        } else {
          if (stderr) {
            console.log("STDERR");
            console.log(stderr);
            order_success = true;
          } else if (stdout) {
            console.log("STDOUT");
            console.log(stdout);
            order_success = true;
          }
          // order_success = true;
        }
        resolve(order_success);
      }
    );
  });
};

const PythonUserData = async (access_token) => {
  return new Promise((resolve, reject) => {
    let args = `${urlencode(access_token)} ${process.env.AMAZON_CLIENT_ID}`;
    execSh(
      `python3 server/python_modules/amazonAuthRequest.py ${args}`,
      true,
      (err, stdout, stderr) => {
        if (err) {
          console.log("Amazon RequestUserData failed.");
          console.log(err);
          resolve(null);
        } else {
          if (stderr) {
            console.log("Errors were printed.");
            console.log(`STDERR:\n${stderr}`);
            resolve(null);
          } else if (stdout) {
            // console.log(`STDOUT:\n${stdout}`);
            let response = JSON.parse(stdout);
            console.log(response);
            resolve(response);
          }
        }
      }
    );
  });
};

export default AmazonPayAPI;
