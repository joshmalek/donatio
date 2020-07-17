# Donatio

<p align="center"><img width=12.5% src="https://github.com/joshmalek/donatio/blob/master/logo192.png"></p>

<p align="center"><img width=100% src="https://github.com/joshmalek/donatio/blob/master/DONATIO-header.png"></p>

![AWS Status](https://img.shields.io/badge/AWS%20Server%20Status-Online-brightgreen)
![ISC](https://img.shields.io/badge/license-ISC-blue.svg) 
[![GitHub](https://img.shields.io/badge/repo-github-green.svg)](https://github.com/joshmalek/donatio)
![Code Style](https://camo.githubusercontent.com/c83b8df34339bd302b7fd3fbb631f99ba25f87f8/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f64655f7374796c652d70726574746965722d6666363962342e737667)
[![Twitter handle][]][Twitter badge]

Be the change you want to see, by buying the things you need.

Donatio is a gamefied platform designed to piggyback on top of current online shopping pages.  A user can choose to donate a percentage of their online purchase (e.g. Amazon) to the Nonprofit of the Day. Our solution uses Amazon Pay for the donation, and the user recieves experience and medals for their donation.  They can share their donations on Twitter, and compete with their friends on the Leaderboard.

An AWSRaiseUp project by [Abdul-Muiz Yusuff](https://github.com/sacrael) & [Josh Malek](https://github.com/joshmalek)

## Features
* Clean, accessible backend with our API running on Graphql.  Graphql provides a browser sandbox for easy query testing, as well as autogenerates documentation.
* Scheduled jobs change the NPO of the day every day at 5pm, summing Donatio users contributions and tracking it in our database.
* Twitter integration, tweeting daily the sum donations for the day, and what the new NPO of the day will be.
* Full user security, with usernames and passwords properly hashed and stored safely in the backend.
* Extensible database design, built with [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
* Full Amazon Pay integration, allowing users to use the accounts and payment options they already have.
* Email confirmation for new accounts, increasing user security and reducing the number of fake accounts.

## Documentation 
This repo consists of the backend of our product.  



## Installation
1. [Install Node.js](https://nodejs.org/en/).  The install will come with [NPM](https://www.npmjs.com/), which is required for package management for Node.
2. Clone the repository to your computer.  This can be done with `git clone https://github.com/joshmalek/donatio.git`.
3. Run `npm install` in the console to retrieve all necessary NPM packages.
4. Add a .env to the root folder with MongoDB Atlas database credentials.  A .env can be provided on request.
5. Run `npm run start` in the console, and the server will run.

[Twitter handle]: https://img.shields.io/twitter/follow/donatioapp?label=Follow&style=social
[Twitter badge]: https://twitter.com/intent/follow?screen_name=donatioapp
