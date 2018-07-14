# Restaurant Reviews App

## Description

The Restaurants Reviews App is a demonstration of mobile-and-offline first web development practices, built as part of a training course with Google and Udacity. The homepage of the app provides a filterable list of restaurants in the New York area, and an option for uses to "favorite" specific restaurants by clicking the heart icon on the restaurant's tile. The details pages of each restaurant provides more information and reviews of that restaurant, as well as a form for submitting user reviews of the restaurant.

## Installation

To get the code for this project up and running to test it out, follow these steps:

* First, make sure you have all of the project's dependencies installed. Development on this codebase requires [Node.js](https://nodejs.org/).
* Once you have Node.js installed, fork and clone this repository onto your local machine.
* In a command line terminal, from the main project directory, run `npm install`.
* You'll also need another repo, which is an API that provides the data that this app uses. Go ahead and clone this repo too, in a separate folder. Follow all of the instructions in this OTHER repo's `readme` file to install its dependencies, and get its server up and running.
* Then, in the terminal for THIS repo, run `npm start` to start the webpack-dev-server. You can now open a browser and test the app by navigating to `http://localhost:3000`. Everything should be good to go!

## Buidling the app

* To get the most accurate results from Google Chrome's lighthouse audits, please run the audits on a build of the app, rather than in development on the webpack dev server.
* To do so, from the project's root directory, run `npm run build`.
* When the build process is complete, run `cd build`, to change into the `build` directory.
* From the `build` directory, run `python GzipServer.py`. This is neccessary for optimum performance, since all text assets are served in gzip form.
* Navigate to `localhost:8000` to visit the app.

## Demoing the app

* At the homepage, in the `Filter Results` section, you can limit the list of restaurants the appears below, as well as the markers on the map.
* On any given restaurant tile, you will see a heart-shaped icon, which you can toggle to indicate whether that restaurant is one of your favorites.
* You can click through to a restaurant's detail info either by clicking a marker on the map, or by clicking the `View Details` button on any of the restaurant tiles.
* On the details page, you can view the details of the restaurant, read reviews, make your own review, and navigate back to the homepage.
* If you make a review while in offline mode, the review will be stored locally inthe browser, and sent to the backend API once the browser is back online.
* Note that the app is fully mobile responsive, and also works offline. If you lose your internet connection, any page you have already visited will still be available to view.

## License

The MIT License

Copyright (c) 2010-2018 Google, Inc. http://angularjs.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
