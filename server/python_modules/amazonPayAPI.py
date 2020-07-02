import sys
from amazon_pay.client import AmazonPayClient
import time

# AmazonPay Python SDK Info: https://github.com/amzn/amazon-pay-sdk-python

def SetOrderAttributes (**kwargs):
    print("Inside SetOrderAttributes()")
    print(kwargs)

    client = AmazonPayClient(
        mws_access_key=kwargs["MWS_ACCESS_KEY"],
        mws_secret_key=kwargs["MWS_SECRET_KEY"],
        merchant_id=kwargs["MERCHANT_ID"],
        region=kwargs["REGION"],
        currency_code=kwargs["CURRENCY_CODE"],
        sandbox=True
    )
    print(client)

    timestamp_ = time.time()
    ret = client.set_order_attributes(
    amazon_order_reference_id=kwargs["ORDER_REF_ID"],
    amount=kwargs["ORDER_TOTAL"],
    currency_code=kwargs["CURRENCY_CODE"],
    seller_note='Thank you for donating {} {} to the charity of the day!'.format(kwargs["ORDER_TOTAL"], kwargs["CURRENCY_CODE"]),
    seller_order_id='#-donatio-{}-{}'.format(timestamp_, kwargs["ORDER_TOTAL"]),
    store_name='Donatio: Gamify your Charity',
    custom_information='-')
    print("Set Order Attributes")
    print(ret.to_json())

    response = client.confirm_order_reference(
        amazon_order_reference_id=kwargs["ORDER_REF_ID"],
        success_url="https://donatio-site.herokuapp.com/paymentStatus?success=true",
        failure_url="https://donatio-site.herokuapp.com/paymentStatus?success=false"
    )

    print("Confirm Order Reference")
    print(response.to_json())

    ## Check the status of the order confirmation
    # reference_details = client.get_order_reference_details(
    #     amazon_order_reference_id

    # )

if __name__ == "__main__":

    # print(str(sys.argv))

    if (len(sys.argv) < 2):
        sys.stderr.write("Error: Expects verbose api name.")
        sys.exit()

    api_name = sys.argv[1]

    if (api_name == 'SET_ORDER_ATTRIBUTES'):
        SetOrderAttributes (
            MWS_ACCESS_KEY= sys.argv[2],
            MWS_SECRET_KEY= sys.argv[3],
            MERCHANT_ID= sys.argv[4],
            REGION= sys.argv[5],
            CURRENCY_CODE= sys.argv[6],
            ORDER_REF_ID= sys.argv[7],
            ORDER_TOTAL= sys.argv[8])