# Restaurant Reviews App

## Description

The Restaurants Reviews App is a demonstration of mobile-and-offline first web development practices, built as part of a training course with Google and Udacity. The homepage of the app provides a filterable list of restaurants in the New York area. The details pages of each restaurant provides more information and reviews of that restaurant.

## Installation

To get the code for this project up and running to test it out, follow these steps:

* First, make sure you have all of the project's dependencies installed. Development on this codebase requires [Node.js](https://nodejs.org/), a global installation of the [Grunt CLI](https://github.com/gruntjs/grunt-cli) (installed AFTER you install Node.js), [GraphicsMagick](http://www.graphicsmagick.org/), and [Python 3](https://www.python.org/).
* Once you have all the dependencies installed, fork and clone this repository onto your local machine.
* In a command line terminal, from the main project directory, run `npm install`.
* To populate a directory with responsive images needed for the app, run `grunt` in the same command line.
* You'll also need another repo, which is an API that provides the data that this app uses. Go ahead and clone this repo too, in a separate folder. Follow all of the instructions in this OTHER repo's `readme` file to get its server up and running.
* Then, in the terminal for THIS repo, run `python3 -m http.server 8000` to start the server. You can now open a browser and test the app by navigating to `http://localhost:8080`. Everything should be good to go!

## Demoing the app

* At the homepage, in the `Filter Results` section, you can limit the list of restaurants the appears below, as well as the markers on the map.
* You can click through to a restaurant's detail info either by clicking a marker on the map, or by clicking the `View Details` button on any of the restaurant tiles.
* On the details page, you can view the details and navigate back to the homepage.
* Note that the app is fully mobile responsive, and also works offline. If you lose your internet connection, any page you have alredy visited will still be available to view.

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
