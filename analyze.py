import numpy as np
import json
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

#first step is rent model

x = []
y = []
featureNames = ['bathrooms', 'bedrooms', 'latitude', 'longitude', 'yearBuilt', 'lotSize', 'livingArea']

with open('data/sold.json', 'r') as f:
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

        homeInfo = p['hdpData']['homeInfo']
        if 'price' not in homeInfo:
            continue

        features = []
        valid = True
        for name in featureNames:
            if name not in homeInfo:
                valid = False

        if not valid:
            continue

        for name in featureNames:
            features.append(homeInfo[name])

        label = homeInfo['price']
    
        x.append(features)
        y.append(label)
        #print(list(p.keys()))

X = np.array(x)
Y = np.array(y)

reg = LinearRegression().fit(X,Y)
print(reg.score(X, Y))
print(reg.coef_)
print(reg.intercept_)

combo = sorted(zip(Y, reg.predict(X)))
actual = [a[0] for a in combo]
pred = [a[1] for a in combo]


plt.plot(actual)
plt.plot(pred)

plt.show()
#models look for x: [[area, baths, beds],] and y: [price,]
