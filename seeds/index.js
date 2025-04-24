const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/camp-together', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) +10;
        const camp = new Campground({
            author: '67fbc400e5d4999c5f6bb8c8',
            location: `${cities[random1000].city}, ${cities[random1000].state}`, 
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas sint odio quibusdam facilis veniam omnis ipsa nulla porro, non veritatis obcaecati, soluta magnam aliquam? Cupiditate aperiam repudiandae obcaecati debitis iste.',
            price: price,
            images: [
                {
                  url: 'https://res.cloudinary.com/du3dtule8/image/upload/v1745363608/CampTogether/i0hsle2hs41jdfhxjoln.jpg',
                  filename: 'CampTogether/i0hsle2hs41jdfhxjoln',
                },
                {
                  url: 'https://res.cloudinary.com/du3dtule8/image/upload/v1745363609/CampTogether/i3slbcojo4p5zlg1cld4.jpg',
                  filename: 'CampTogether/i3slbcojo4p5zlg1cld4',
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});