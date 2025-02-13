import { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import StarRaiting from './starRaiting';

const ApiMovie = {
  key: '85b0bd58', 
  urlBase: function () {return `http://www.omdbapi.com/?apikey=${this.key}&`}, 
  urlPosterBase: function () {return `http://img.omdbapi.com/?apikey=${this.key}&`}, 
  defaultImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvL7OIgU_VItYXpqGro-eq2zo1MjT6SsaDDg&s'
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0).toFixed(2);

// -------------------------------------- presentational Components

function Logo() { // presentational
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function NumResults({countMovie}) { // presentetional
  return (
  <p className="num-results">
    Found <strong>{countMovie}</strong> results
  </p>
  )
}

function Movie({movie, onSelect}) { // presentational
  return (
  <li onClick={onSelect}>
    <img loading="lazy" src={movie.Poster==='N/A' ? ApiMovie.defaultImage : movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>
  )
}

function MovieList({movies, onSelect}) { // presentational
  return (
  <ul className="list list-movies">
    {movies?.map((movie) => <Movie movie={movie} key={movie.imdbID} onSelect={ () => onSelect(movie.imdbID) } />)}
  </ul>
  )
}

function WatchedSummary({watched}) { // presentational  
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime));

  return (
  <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>
  )
}

function WatchedMovie({movie, onDelete}) { // presentational
  return (
  <li>
    <img src={movie.Poster!=='N/A' ? movie.Poster : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvL7OIgU_VItYXpqGro-eq2zo1MjT6SsaDDg&s'} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.Runtime} min</span>
      </p>

      <button className="btn-delete" onClick={onDelete}>✖️</button>
    </div>
  </li>
  )
}

function WatchedList({watched, onDelete}) { // presentational
  return (
    <ul className="list">
    {watched.map((movie) => <WatchedMovie movie={movie} key={movie.imdbID} onDelete={ () => onDelete(movie.imdbID) } /> )}
  </ul>
  )
}

function LoaderMovie() { // presentational
  return (
    <li className="loading-movie">
      <Skeleton height={53} baseColor="#17202a" highlightColor="#212f3d" />
      <div>
        <Skeleton width={100} height={10} baseColor="#17202a" highlightColor="#212f3d" />
        <div>
          <span>🗓</span>
          <Skeleton width={50} height={10} baseColor="#17202a" highlightColor="#212f3d" />
        </div>
      </div>
  </li>
  )
}

function LoaderMovies({countMovie}) { // presentational
  return (
    <ul className="list">
      { Array(countMovie).fill({}).map( (_, index) => <LoaderMovie key={index} /> ) }
    </ul>
  )
}

function ErrorMessage({message, resetError}) { // presentational
  const scroller = useRef(null);
  const containError = useRef(null);

  useEffect( () => {
    function AutomaticDestruction() {
      let scrollWidth = 100;
  
      const time = setInterval( () => {
        if ( scroller.current===null ) {
          clearInterval(time);
        } else if ( scrollWidth<=0 ) {
          clearInterval(time);
          containError.current.classList.add('scroller-close');
          setTimeout( () => {
            resetError();
          }, 1000 );
        }
        if ( scroller.current!==null ) {
          scroller.current.style.width = `${scrollWidth}%`;
        }
        scrollWidth -= 1;
      }, 25 );
    }
    AutomaticDestruction();
  }, [resetError] );

  return (
    <div className="error" ref={containError}>
      <p>{message}</p>

      <div className="scroller" ref={scroller}></div>
    </div>
  )
};

// -------------------------------------- stateful Components

function Search({onSearch}) { // stateful
  return (
    <input
      onChange={ e => onSearch(e.target.value)}
      className="search"
      type="text"
      placeholder="Search movies..."
    />
  )
}

function Box({children}) {  // stateful
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen(state => !state)}
      >
        {isOpen ? "–" : "+"}
      </button>
        {isOpen && children}
    </div>
    )
}


// -------------------------------------- Structural Components

function NavBar({children}) { // structural
  return (
  <nav className="nav-bar">
    <Logo />
    {children}
  </nav>
  )
}

function Main({children}) { // structural
  return (
  <main className="main">
    {children}
  </main>
  )
};


function DetailsMovie({id, onClose, onAddWatched, watched}) {
  const [movie, setMovie] = useState([{}, false]);
  const [userRating, setUserRating] = useState(0);
  const isWatched = watched.map( movie => movie.imdbID ).includes(id);
  const watchedUserRating = watched.find( movie => movie.imdbID===id )?.userRating;

  const {
    Title='',
    Year='',
    Poster, 
    Runtime, 
    imdbRating, 
    Plot, 
    Released, 
    Actors, 
    Director, 
    Genre
    } = movie[0];
  
  function handlerAdd() {
    const newMovie = {
      imdbID: id, 
      Title, Year, Poster, 
      imdbRating: imdbRating==='N/A' ? 0 : Number(imdbRating), 
      Runtime: Runtime==='N/A' ? 0: Number(Runtime.split(' ').at(0)), 
      userRating: userRating
    };

    onAddWatched(newMovie);
    onClose();
  }

  useEffect(() => {
    async function getMovieDetails() {
      const response = await fetch(`${ApiMovie.urlBase()}i=${id}`);
      const data = await response.json();
      setMovie( [data, true] );
      document.title = `Movie: ${data.Title}`;
    }
    setMovie( [{}, false] );
    getMovieDetails();
    return () => {
      document.title = 'usePopcorn';
    }
  }, [id]);

  function handlerRating(rating) {
    setUserRating( rating );
  }
  return (
    <>
    { movie[1] ? (
    <div className="details">
    <header>
      <button onClick={onClose} className="btn-back">
        <svg width="25px" height="25px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"/><path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"/></svg>
      </button>
      <img src={Poster==='N/A' ? ApiMovie.defaultImage : Poster} alt={`Poster of ${Title}`} />
      <div className="details-overview">
        <h2>{Title}</h2>
        <p>
          {Released} &bull; {Runtime}
        </p>
        <p>{Genre}</p>
        <p><span>⭐</span> {imdbRating}</p>
      </div>
    </header>
    <section>
      <div className="rating">
        { !isWatched ? (<>
          <StarRaiting maxRaiting={10}  onClick={handlerRating} />
          { userRating>0 && <button className="btn-add" onClick={handlerAdd}>+ Add To List</button> }     
        </>) : (
          <p>You Rated Width Movie {watchedUserRating} ⭐</p>
        ) }

      </div>
      <p><em>{Plot}</em></p>
      <p>Starring {Actors}</p>
      <p>Directed by {Director}</p>
    </section>
  </div> ) :
  <DetailsMovieLoaded /> }
  </>

  )
};

function DetailsMovieLoaded() {
  return (
    <div className="details">
      <header>
        <Skeleton width={30} height={30} className="btn-back btn-back-loaded" baseColor="#17202a" highlightColor="#212f3d" />
        <Skeleton width={150} height={200} baseColor="#17202a" highlightColor="#212f3d" />
        <div className="details-overview">
          <Skeleton width={100} height={20} baseColor="#17202a" highlightColor="#212f3d" />
          <Skeleton width={100} height={20} baseColor="#17202a" highlightColor="#212f3d" />
          <Skeleton width={100} height={20} baseColor="#17202a" highlightColor="#212f3d" />
          <Skeleton width={100} height={20} baseColor="#17202a" highlightColor="#212f3d" />
        </div>
      </header>
      <section>
        <Skeleton width={250} height={80} baseColor="#17202a" highlightColor="#212f3d" />
        <Skeleton width={225} height={60} baseColor="#17202a" highlightColor="#212f3d" />
        <Skeleton width={225} height={30} baseColor="#17202a" highlightColor="#212f3d" />
        <Skeleton width={225} height={20} baseColor="#17202a" highlightColor="#212f3d" />
      </section>
    </div>
  )
};

export default function App() { // structural
  const [movies, setMovies] = useState([]); // global state
  const [watched, setWatched] = useState([]); // global state
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState([false, '']);
  const [ selected, setSelected ] = useState(null);
  const [ searchInput, setSearchInput ] = useState('tell');

  function addWatchedHandler(movie) {
    setWatched( watched => [...watched, movie] )
  }

  function deleteWatchedHandler(id) {
    setWatched( watched => watched.filter( movie => movie.imdbID !== id ) )
  }

  
  useEffect( () => {
    const controller = new AbortController();

    async function apiFetch(search) {
      try {
        setIsError([false, '']);
        let response = await fetch(`${ApiMovie.urlBase()}s=${search}`, {
          signal: controller.signal
        });
        let responseData = await response.json();
  
        if ( responseData.Response==='True' ) {
          setMovies( _ => responseData.Search );
          setIsLoading( false );
          setIsError([false, '']);
        } else throw Error(responseData.Error);
  
      } catch (err) {
        if ( err.message === 'Failed to fetch' ) {
          setIsError( () => [true, 'There is a problem with the server'] )
        } else {
          if ( err.name !== 'AbortError' ) {
            setIsError( () => [true, err.message]  )
          }
        }
      }
    }
    if ( searchInput !== '' ) {
      apiFetch(searchInput);
    }
    return () => {
      controller.abort();
    }
  }, [searchInput] );


  useEffect( () => {
    document.addEventListener('keydown', e => {
      if ( e.code === 'Escape' ) {
        setSelected(null);
      }
    })
  }, [] );

  function searchHandler(search) {
    setSearchInput(_ => search);
    setSelected(null);
  }

  return (
    <>
      <NavBar>
        <Search onSearch={ searchHandler } />
        <NumResults countMovie={movies.length} />
      </NavBar>

      <Main className='main'>
        <Box>
          { isLoading ? <LoaderMovies countMovie={5} /> : <MovieList movies={movies} onSelect={(id) => setSelected( selected===id ? null : id  )} /> }
          { isError[0] && <ErrorMessage message={isError[1]} resetError={() => setIsError([false, ''])} /> }
        </Box>

        <Box>
          { selected ? <DetailsMovie watched={watched} id={selected} onClose={() => setSelected(null)} onAddWatched={addWatchedHandler} /> : <>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} onDelete={deleteWatchedHandler} />
          </> }
        </Box>
      </Main>
    </>
  );
};


