# Iron Truck
Iron truck is a serverless application that is triggered by an HTTP `GET` request to `https://iron-truck.azurewebsites.net/api/localTrucks?latitude=<latitude>&longitude=<longitude>` where longitude and latitude are the coordinates to find the five closest food trucks in San Francisco. Try it out [here](https://iron-truck.azurewebsites.net/api/localTrucks?latitude=37.78304609975&longitude=-122.39406659923). Iron truck leverages the [serverless framework](https://serverless.com/framework/). All business logic is located in [src/handler.js](src/handler.js).

## Prerequisites
NPM and node are installed. To install the latest, see the [official node website](https://nodejs.org/en/).

## Installing dependencies
Run `npm install`.

## Running tests
After installing dependencies, run `npm test`.

## Continuous Integration
[![CircleCI](https://circleci.com/gh/danjwinter/iron-truck.svg?style=svg)](https://circleci.com/gh/danjwinter/iron-truck)
Continuous integration is setup with CircleCI, click on the badge to see the latest build.

## Continuous Deployment
Continuous deployment is setup with git webhooks so that any code merged to master is deployed through Azure Functions. Master is a protected branch that needs a pull request and to have passed the test phase in CircleCI.

## Development Thoughts
Upon reading the problem statement, I thought of a serverless application because there will not be a lot of requests and no need to run and maintain a server. With the dataset available, there is an API that can be used to query and offload much of the business logic to the actual database, removing the need to maintain one for this application. I used the serverless framework because it allows you to more easily switch between serverless platforms should the need arise. It also abstracts a lot of the platform specific knowledge away like creating resource groups or a functionapp in Azure. One downside of this approach is that the requests aren't the fastest. Queries are generally taking 200-450 milliseconds which could be problematic if customers needed a faster turnaround. In that case, it might be more beneficial to store the data in our own database to tweak performance.

I've used the serverless framework in the past for a couple spikes using AWS Lambda but never for Azure Functions.

I ran into issues when trying to setup continuous deployment and installing the serverless framework azure plugin within CircleCI. It seems the azure plugin for the serverless framework only works well on MacOs, which you can get using CircleCI with a paid subscription, though I do not have a paid subscription. I also spent too much time trying to get this to work. I was able to work around this by setting up continuous deployment within Azure Functions so that any changes to master, a protected branch, will deploy. I would prefer to see it during the CI process so that I could tell if a build was successfully tested and deployed in one spot. There is currently also the possibility of getting code into master that inhibits deployment by altering some of the deployment configs. This could be a hard to track down issue since the deployment is obscured in Azure Functions. Additionally, I tried briefly using the Azure Functions instructions to use their CLI to create and deploy a function but the deploy was unsuccessful and I didn't have more time to troubleshoot. 

The current tests are not as robust as I would like. There is a single happy path test that is brittle because it will break if there are newer, closer food trucks approved near the chosen coordinates. To ease this, I would look into a VCR-like node library that would allow you to record and rotate tapes of external requests when tests are run. A tape rotation strategy would allow the data to be updated more frequently while still testing to ensure that the query hasn't changed. 

Currently, the endpoint returns the 5 closest food trucks based on your location. As a next step, I would have the query also pay attention to the schedule so that it would only return food trucks that are open on the day of the request or take an optional day or date parameter to check for other days. Additionally, the distance to the food truck is a long float that is not too user friendly so that should be truncated and perhaps turned into miles when the distances get longer. A quick static website that asked a user to access their location before firing off that geolocation to this Azure Function would make it much more user friendly than needing to enter in latitude and longitude. Google map directions could also be a helpful addition. These features should be triaged based on customer feedback. 