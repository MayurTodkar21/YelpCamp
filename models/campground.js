const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CampgroundSchema = new Schema({
    title : String,
    images: [
        {
        url: String,
        filename:String 
        }
    ],
    geometry: {
        type: {
            type: String,
            enum:['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price : Number,
    description :String,
    location :String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
CampgroundSchema.post('findOneAndDelete', async function (doc){
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }

})
module.exports = mongoose.model('Campground', CampgroundSchema);