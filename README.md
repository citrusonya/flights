# Flight Search Results Page

![screenshot](https://github.com/citrusonya/flights/blob/master/gif.gif)
____

:ticket: Sort tickets by price

:clock5: Sort tickets by flight time

:running: Filtering by the presence of a connection between flights

:moneybag: Filter by price range

:airplane: Filter by airline
____

## Getting Started
```
git clone https://github.com/citrusonya/flights.git
```
## Scripts
Make sure you have Webpack installed.

### Run the app in Hot Reloading mode
```
npm start
```
### Create development build
```
npm run dev
```
### Create production build (with file minification)
```
npm run build
```
## Important
If Hot Reloading does not work, check ```webpack``` and ```webpack-dev-server``` version. 

In my case, works bundle: ```webpack: 5.23.0``` with ```webpack-dev-server: 4.0.0-beta.0```.

## Note
The logo of one airline is not loaded, because the script unloads the name of the image from the JSON file. Since the airline contains a slash ```/``` in its name, and this symbol cannot be used in the file name, therefore, the script will search by the name with a slash, but will not find it. If you need to upload a logo, you should update the data in the JSON file.


Also, when the script run through the data, it was found that in some places the name of the departure city (LONDON) was missing in the file, so ```.js``` file contains a check for the presence of the "departureCity" field, and if it is not there, it is added.
