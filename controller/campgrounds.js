const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken : mapBoxToken});
module.exports.loggedIn =(req,res) =>{

    res.render('campgrounds/new')

}
module.exports.index = async (req,res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/indes',{campgrounds})
}

module.exports.createCampground = async(req,res,next) =>{       
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);        
        const geoData = await geocoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send()
        
        
        const campground = new Campground(req.body.campground);
        campground.geometry = geoData.body.features[0].geometry;
        campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
        campground.author = req.user_id;
        await campground.save();
        console.log(campground);
        req.flash('success', 'successfully made a new campground')
        res.redirect(`/campgrounds/${campground._id}`)
   
}

module.exports.getform = async (req,res) => {
    const campground = await Campground.findById(req.params._id).populate({
        path:'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'cannot find');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground})
}

module.exports.editroute = async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params._id)
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'permission require');
        return res.redirect(`/campgrounds/${id}`);
    }
    res.render('campgrounds/edit', {campground})
}

module.exports.postform = async(req, res) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'permission require');
        return res.redirect(`/campgrounds/${id}`);
    }
    const camp = await Campground.findOneAndUpdate(id, {...req.body.campground})
    req.flash('success', 'successfully Updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteform = async(req,res) =>{
    
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'permission require');
        return res.redirect(`/campgrounds/${id}`);
    }
     await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}