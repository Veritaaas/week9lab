let Actor = require('../model/actor');
let Movie = require('../model/movie');
let mongoose = require('mongoose');
let print = console.log;
module.exports = {
    getAll: function (req, res) {
        Movie.find({}).populate('actors').exec(function(err,movie){
            if (err) {
                return res.status(400).json(err);
            }
            else if (!movie) {
                return res.status(404).json();
            };
            res.json(movie);

        });
        // Movie.find(function (err, movies) {
        //     if (err) return res.status(400).json(err);
        //     res.json(movies);
        // });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id },function(err,result){
            if(err){
                return res.status(400).json(err)
            }else{
                res.json(result);
            }
        });
    },

    deleteActorFromMovie: function(req,res){
        Movie.findOne({_id: req.params.mid},function(err,movie){
            console.log(movie);
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            for (let i=0;i<movie.actors.length;i++){
                console.log(movie.actors.length);
                console.log(req.params.aid)
                if (movie.actors[i] == req.params.aid){
                    console.log(movie.actors[i])
                    console.log(i)
                    movie.actors.splice(i,1);
                    console.log(movie.actors)
                }
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json();
                });

            }
        })
    },

    addActorToMovie:function(req,res){
        Movie.findOne({ _id: req.params.mid }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.params.aid }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    },
    getByYear:function(req,res){
        Movie.find({year:{$gte:req.params.year2,$lte:req.params.year1}},function(err,docs){
            console.log(docs);
            if (err) return res.status(400).json(err);
            res.json(docs);
        })
    },
    delByYear:function(req,res){
        print(req.body.year1);
        print(req.body.year2);
        Movie.deleteMany({year:{$lt:req.body.year1},year:{$gt:req.body.year2}},function(err,doc){
            res.json(doc);
        })
    },
    movNameInAct:function(req,res){
        Actor.find({name:req.params.name},function(err,data){
            if(err) return res.status(400).json(err);
            if (data.length == 0) return res.status(404).json();
            print(data);
            
            for (let i=0;i<data.length;i++){
                let titles=[];
                print(data[i].movies);
                if(data[i].movies.length == 0){
                    print('No movie in this actor '+data[i].name);
                }
                for(let j=0; j<data[i].movies.length;j++){
                    Movie.find({_id:data[i].movies[j]},'title',function(err,result){
                        if(err) return res.status(400).json(err);
                        if (!result) return res.status(404).json();
                        print(j+1 + ' movie in actor '+data[i].name);
                        titles.push(result);
                        print(titles);
                    })
                    
                }
                res.json(titles);
            }
            
        })
    },
    delBeforeYear:function(req,res){
        Movie.deleteMany({year:{$lt:req.params.delYear}},function(err,movie){
            res.json(movie);
        })
        console.log(req.params.year)
    },
    addAct:function(req,res){
        Actor.findOne({name:req.params.name},function(err,actor){
            console.log(actor);
            Movie.updateOne({title:req.params.title},{$push:{actors:actor._id}},function(err,movie){
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                console.log(movie);
            })
        })
    }
    
};