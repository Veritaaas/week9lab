import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../database.service";
@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  movieDB: any[] = [];
  title:string = "";
  year:number = 0;
  movieId: string ="";
  delYear: number=0;

  section = 1;

  actorDB: any[] = [];
  fullName: string = "";
  
  
  constructor(private dbService: DatabaseService) { }

  ngOnInit() {
    this.onGetMovies();
    this.onGetActors();
  }
  changeSection(sectionId) {
    this.section = sectionId;
    this.resetValues;
  }

  resetValues() {
    this.title = "";
    this.year = 0;
    this.movieId = "";
  }
  onGetMovies() {
    this.dbService.getMovies().subscribe((data: any[]) => {
      this.movieDB = data;
    });
  }
  onSaveMovie() {
    let obj = { title: this.title, year: this.year };
    this.dbService.createMovie(obj).subscribe(result => {
      this.onGetMovies();
    });
  }
  onDeleteMovie(item) {
    this.dbService.deleteMovie(item._id).subscribe(result => {
      this.onGetMovies();
    });
  }

  onDelBeforeYear(){
    this.dbService.delBeforeYear(this.delYear).subscribe(result => {
      this.onGetMovies();
    });
  }

  onGetActors() {
    this.dbService.getActors().subscribe((data: any[]) => {
      this.actorDB = data;
    });
  }

  onaddAToM(){
    this.dbService.addActToMov(this.fullName,this.title).subscribe(result => {
      this.onGetMovies();
    });
  }
  
}
