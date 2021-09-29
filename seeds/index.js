
const mongoose = require('mongoose');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection_error"));
db.once("open", () =>{
    console.log("DATABASE connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0 ; i <50 ; i++){
        const random1000 = Math.floor(Math.random() *1000);
        const price= Math.floor(Math.random()* 20) + 10;
        const camp = new Campground({
            author: '6148489034e06f39b288d49d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            
            description:'lorem impsum dolor sit amet consecteture',
            price,
            geometry:{
                type: "Point",
                coordinates:  [ 
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                 ] 
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/daquonbkd/image/upload/v1632477240/YelpCamp/fnweqjuvvk5d3mwkjejt.jpg',
                    filename: 'YelpCamp/fnweqjuvvk5d3mwkjejt',
      
                }

            ]

        })
        await camp.save();

    }
}

seedDB().then(() => {
    mongoose.connection.close();
})