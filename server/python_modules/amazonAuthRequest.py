# Request user information through access tokens provided
# by Amazon.

import io
import pycurl
import urllib
import json
import sys

def amazonAuth(**kwargs):
    b = io.StringIO ()
    c = pycurl.Curl ()
    c.setopt(pycurl.URL, "https://api.sandbox.amazon.com/auth/o2/tokeninfo?access_token="
    + urllib.quote_plus(kwargs["access_token"]))
    c.setopt(pycurl.SSL_VERIFYPEER, 1)
    c.setopt(pycurl.WRITEFUNCTION, b.write)

    c.perform()
    d = json.loads(b.getvalue())

    if d['aud'] != kwargs["client_id"]:
        sys.stderr.write("Access token is not for your application.")
        sys.exit()

    b = io.StringIO ()
    c = pycurl.Curl()

    c.setopt(pycurl.URL, "https://api.sandbox.amazon.com/user/profile")
    c.setopt(pycurl.HTTPHEADER, ["Authorization: bearer " + kwargs["access_token"]])
    c.setopt(pycurl.SSL_VERIFYPEER, 1)
    c.setopt(pycurl.WRITEFUNCTION, b.write)
    
    c.perform()
    d = json.loads(b.getvalue())
    print(str(d))


if __name__ == "__main__":
    if (len(sys.argv) < 3):
        sys.stderr.write("Error: Expects verbose api name.")
        sys.exit()

    amazonAuth(
        access_token=sys.argv[1], 
        client_id=sys.argv[2]
    )