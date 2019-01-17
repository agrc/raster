from hashlib import sha256
from pprint import pprint
from urllib.parse import urlencode

import requests

url = 'http://localhost:8080/resourcespace/api/?'
private_key = 'b3275acd18dd35edb2cd4aad9ad158b9332267046bd0b16751003a67529741f7'


def make_request(payload):
    query = urlencode(payload)

    sign = sha256((private_key + query).encode('utf-8')).hexdigest()

    request_url = '{}{}&sign={}'.format(url, query, sign)
    response = requests.get(request_url)
    pprint(response.json())
    print(request_url)


# make_request({
#     'function': 'do_search',
#     'user': 'testapi',
#     'param1': ''
# })
make_request({
    'function': 'get_resource_data',
    'user': 'testapi',
    'param1': 24
})
