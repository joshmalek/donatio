import axios from "axios";

const AmazonPayAPI = {
  SetOrderReferenceDetails: async (
    donation_amount,
    currency_code,
    order_ref_id
  ) => {
    console.log(`Sset Order Reference Details called`);

    console.log(`Donation Amount: ${donation_amount}`);
    console.log(`Order Ref ID: ${order_ref_id}`);
  },
};

export default AmazonPayAPI;
