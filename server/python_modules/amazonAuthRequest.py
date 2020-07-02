# Request user information through access tokens provided
# by Amazon.

import io
import pycurl
# import urllib
import json
import sys
import urllib.parse

class Storage:
    def __init__(self):
        self.contents = ''
        self.line = 0

    def store(self, buf):
        self.line = self.line + 1
        self.contents = "{}{}: {}".format(self.contents, self.line, buf)

    def __str__(self):
        return self.contents

def amazonAuth(**kwargs):

    # Part 1: Verify access token
    retrieved_body = Storage()
    retrieved_headers = Storage()
    b = io.BytesIO ()
    c = pycurl.Curl ()
    c.setopt(pycurl.URL, "https://api.sandbox.amazon.com/auth/o2/tokeninfo?access_token="
    + urllib.parse.quote_plus(kwargs["access_token"]))
    c.setopt(pycurl.SSL_VERIFYPEER, 0)
    c.setopt(pycurl.SSL_VERIFYHOST, 0)
    c.setopt(pycurl.WRITEFUNCTION, b.write)

    try:
        c.perform()
    except pycurl.error as e:
        sys.stderr.write("Curl failed in perform.")
        sys.exit ()
    
    response_str = b.getvalue().decode("utf-8")
    d = json.loads(response_str)

    if d['aud'] != kwargs["client_id"]:
        sys.stderr.write("Access token is not for your application.")
        sys.exit()

    # Part 2: Retrieve the user data
    b = io.BytesIO ()
    c = pycurl.Curl()

    c.setopt(pycurl.URL, "https://api.sandbox.amazon.com/user/profile")
    c.setopt(pycurl.HTTPHEADER, ["Authorization: bearer " + kwargs["access_token"]])
    c.setopt(pycurl.SSL_VERIFYPEER, 0)
    c.setopt(pycurl.SSL_VERIFYHOST, 0)
    c.setopt(pycurl.WRITEFUNCTION, b.write)
    
    try:
        c.perform()
    except pycurl.error as e:
        sys.stderr.write("Curl failed in perform.")
        sys.exit ()

    response_str = b.getvalue().decode("utf-8")
    d = json.loads(b.getvalue())
    print(str(d))


if __name__ == "__main__":

    if (len(sys.argv) < 3):
        sys.stderr.write("Error: Expects verbose api name.")
        sys.exit()

    access_token = sys.argv[1]
    access_token = urllib.parse.unquote(access_token)

    amazonAuth(
        access_token=access_token, 
        client_id=sys.argv[2]
    )