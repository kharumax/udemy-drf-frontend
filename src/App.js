import React, {Component} from 'react';
import './App.css';
import MovieList from "./components/movie-list";
import MovieDetails from "./components/movie-details";
import MovieForm from "./components/movie-form";
import Login from "./components/login";
import {withCookies } from "react-cookie";

var FontAwesome = require("react-fontawesome");

class App extends Component{

    state = {
        movies: [],
        selectedMovie: null,
        editMovie: null,
        token: this.props.cookies.get("mr-token")
    };

    componentDidMount() {
        if (this.state.token) {
            //fetch data
            fetch(`${process.env.REACT_APP_API_URL}/api/movies/`,{
                method: "GET",
                headers: {
                    "Authorization": `Token ${this.state.token}`
                }
            })
                .then(resp => resp.json())
                .then(resp => this.setState({movies:resp}))
                .catch(error => console.log(error))
        } else {
            window.location.href = "/";
        }

    }

    loadMovie = movie => {
        this.setState({
            selectedMovie: movie,
            editMovie:null
        });
    };

    movieDeleted = selMovie => {
        const movies = this.state.movies.filter( movie => movie.id !== selMovie.id );
        this.setState({
            movies:movies,selectedMovie: null
        })
    };

    editClicked = selMovie => {
        this.setState({
            editMovie: selMovie
        });
    };

    newMovie = () => {
        this.setState({editMovie:{title:"",description:""}})
    };

    cancelForm = () => {
        this.setState({editMovie:null});
    };

    addMovie = movie => {
        this.setState({movies: [...this.state.movies,movie]})
    };

    render() {
          return (
              <div className="App">
                  <h1>
                      <FontAwesome name="film"/>
                      <span>Movie Rater</span>
                  </h1>
                  <div className="layout">
                      <MovieList movies={this.state.movies} movieClicked={this.loadMovie}
                                movieDeleted={this.movieDeleted} editClicked={this.editClicked}
                                 newMovie={this.newMovie} token = {this.state.token}
                      />
                      <div>
                          { !this.state.editMovie? (
                              <MovieDetails movie={this.state.selectedMovie} updateMovie={this.loadMovie}
                                            token = {this.state.token}
                              />
                          ) :(
                              <MovieForm movie={this.state.editMovie} cancelForm={this.cancelForm}
                                         newMovie={this.addMovie} editedMovie={this.loadMovie}
                                         token = {this.state.token}
                              />)}
                      </div>
                  </div>
              </div>
          );
      }
}

export default withCookies(App);
