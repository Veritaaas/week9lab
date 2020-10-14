let mongoose = require('mongoose');
let Actor = require('../model/actor');
let Movie = require('../model/movie');
let print = console.log;

module.exports = {
    getAll: function (req, res) {
        Actor.find({}).populate('movies').exec(function(err,actor){
            if (err) {
                return res.status(400).json(err);
            }
            else if (!actor) {
                return res.status(404).json();
            };
            res.json(actor);

        });
        // Actor.find(function (err, actors) {
        //     if (err) {
        //         return res.status(404).json(err);
        //     } else {
        //         res.json(actors);
        //     }
        // });
    },
    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();
        Actor.create(newActorDetails, function (err, actor) {
            if (err) return res.status(400).json(err);
            res.json(actor);
        });
    },
    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },
    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
    },

    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.aid }, function (err, actor) {
            
            console.log(actor);
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({ _id: req.body.mid }, function (err, movie) {
                console.log(movie);
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                console.log(movie);
                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    },
    deleteOneAndMovie:function(req,res){
        Actor.findByIdAndRemove({ _id: req.params.id }, function (err,actor) {
            print(actor)
            if (err) return res.status(400).json(err);
            Movie.deleteMany({actors:req.params.id},function(error){
                print(req.params.id);
                if (error) return res.status(400).json(error);
                res.json(actor);
            })
        });
    },

    deleteMovieFromActor:function(req,res){
        Actor.findOne({_id: req.params.aid},function(err,actor){
            console.log(actor);
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            for (let i=0;i<actor.movies.length;i++){
                console.log(actor.movies.length);
                console.log(req.params.mid)
                if (actor.movies[i] == req.params.mid){
                    console.log(actor.movies[i])
                    console.log(i)
                    actor.movies.splice(i,1);
                    console.log(actor.movies)
                }
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json();
                });

            }
        })
    },
    getActFromMovie:function(req,res){
        Movie.find({year:req.params.year},function(err,data){
            if(err) return res.status(400).json(err);
            if (data.length == 0) return res.status(404).json();
            print(data);
            for (let i=0;i<data.length;i++){
                print(data[i].actors);
                if(data[i].actors.length == 0){
                    print('No actor in movie '+data[i].title);
                }
                for(let j=0; j<data[i].actors.length;j++){
                    print(data[i].actors[j]);
                    Actor.findById({_id:data[i].actors[j]},function(err,result){
                        if(err) return res.status(400).json(err);
                        if (!result) return res.status(404).json();
                        print(j+1 + ' actor in movie '+data[i].title);
                        res.json(result);
                    })
                }
            };

            
            
            
            
        });
    }
}