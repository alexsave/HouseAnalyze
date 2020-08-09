import numpy as np
import json
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

#first step is rent model

x = []
y = []

with open('data/rent.json', 'r') as f:
    data = json.load(f) 

    common = list(data['properties'][0].keys())
    for p in data['properties']:
        common = [a for a in common if a in p.keys()]

    #print(common)

    #lets start super simple at first
    #bedroom and bathroom
    for p in data['properties']:
        if 'hdpData' not in p:
            continue

        features = []
        features.append(p['hdpData']['homeInfo']['bathrooms'])
        features.append(p['hdpData']['homeInfo']['bedrooms'])
        label = p['hdpData']['homeInfo']['price']
    
        x.append(features)
        y.append(label)
        #print(list(p.keys()))

X = np.array(x)
Y = np.array(y)

reg = LinearRegression().fit(X,Y)
print(reg.score(X, Y))
print(reg.coef_)
print(reg.intercept_)


plt.plot(Y)

#plt.plot(Y)
plt.plot(reg.predict(X))
plt.show()
#models look for x: [[area, baths, beds],] and y: [price,]
