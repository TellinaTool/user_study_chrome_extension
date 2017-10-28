""" print_history prints the raw json history downloaded by options.js in 
readable form.
"""

import json
from pprint import pprint

with open('data.json') as data_file:    
    data = json.load(data_file)
    print("Seconds | URL")
    
    # iterates over all pages in history and prints the duration and url
    # a duration of 0 means that the page was visited for under a second
    for h in data['history']:
        print (h['endTime']-h['startTime'])/1000, h['url']
