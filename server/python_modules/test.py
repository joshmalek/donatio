from pay_with_amazon.client import PayWithAmazonClient
from amazon_pay.client import AmazonPayClient

client = AmazonPayClient(
    mws_access_key='AKIAJ5UW7IIODOHZSZKQ',
    mws_secret_key='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',
    merchant_id='A2PNSD9U3NZBP4',
    region="na",
    currency_code="USD",
    sandbox=True)

print(client)