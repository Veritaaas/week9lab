let bodyParser = require('body-parser');
let express = require('express');
let mongoose = require('mongoose');
let movieRoute = require('./router/movieRoute');
let actorRoute = require('./router/actorRoute');
let app = express();
let path = require('path');
app.listen(8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


let url = "mongodb://localhost:27017/movies";
app.use("/", express.static(path.join(__dirname, "dist/week9lec")));
mongoose.connect(url, function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');
});

//Configuring Endpoints
//Actor RESTFul endpoionts 
app.get('/actors', actorRoute.getAll);
app.post('/actors', actorRoute.createOne);
//app.get('/actors/:id', actorRoute.getOne);
app.put('/actors/:id', actorRoute.updateOne);
app.post('/actors/:aid/movies', actorRoute.addMovie);



//Movie RESTFul  endpoints
app.get('/movies', movieRoute.getAll);
app.post('/movies', movieRoute.createOne);
app.get('/movies/:id', movieRoute.getOne);
app.put('/movies/:id', movieRoute.updateOne);


//Task 1
app.delete('/movies/:id',movieRoute.deleteOne);
//Task 2
app.delete('/actors/:id', actorRoute.deleteOneAndMovie);
//Task 3
app.delete('/actors/:aid/movies/:mid',actorRoute.deleteMovieFromActor);
//Task 4
app.delete('/movies/:mid/actors/:aid',movieRoute.deleteActorFromMovie);
//Task 5
app.post('/movies/:mid/:aid',movieRoute.addActorToMovie);
//Task 6
app.get('/movies/year/:year1/:year2',movieRoute.getByYear);
//Task 8
app.delete('/movies',movieRoute.delByYear);

//extra
app.get('/actors/actorBymovieYear/:year',actorRoute.getActFromMovie);

app.get('/movies/movieByActname/:name',movieRoute.movNameInAct);


//Week 9 lab
app.delete('/movies/delBeforeYear/:delYear',movieRoute.delBeforeYear);
app.put('/movies/addActToMov/:name/:title',movieRoute.addAct)