import json

#first step is rent model

with open('data/rent.json', 'r') as f:
    data = json.load(f) 
    for k,v in data.items():
        print(k, v)
