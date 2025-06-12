import React, { useContext, useEffect, useState } from 'react';
import { KeycloakContext } from './KeycloakContext';

function App() {
  const [movies, setMovies] = useState([]);
  const { keycloak, isAuthenticated } = useContext(KeycloakContext);

  useEffect(() => {
    if (isAuthenticated && keycloak) {
      keycloak.updateToken(30)
        .then(() => {
          fetch('https://backend-quarkus-demo.apps.cluster-2xg4r.2xg4r.sandbox2806.opentlc.com/api/movie', {
            headers: {
              Authorization: 'Bearer ' + keycloak.token,
            },
          })
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
          .then(data => setMovies(data))
          .catch(err => console.error('Error fetching movies:', err));
        })
        .catch(() => {
          console.warn('Token refresh failed');
        });
    }
  }, [isAuthenticated, keycloak]);

  const logout = () => keycloak.logout();

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>Películas disponibles</h1>
        {isAuthenticated && (
          <button onClick={logout} style={styles.logoutButton} aria-label="Cerrar sesión">
            Cerrar sesión
          </button>
        )}
      </header>

      <main style={styles.movieGrid}>
        {movies.length === 0 && (
          <p style={styles.noMovies}>No hay películas disponibles.</p>
        )}
        {movies.map(movie => (
          <article key={movie.title} style={styles.movieCard} tabIndex="0" aria-label={`${movie.title}, ${movie.year}`}>
            <h2 style={styles.movieTitle}>{movie.title} <span style={styles.movieYear}>({movie.year})</span></h2>
            <p style={styles.movieGenre}>{movie.genre.join(', ')}</p>
            <p style={styles.movieDuration}>Duración: {movie.duration} min</p>
          </article>
        ))}
      </main>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f9f9fb',
    minHeight: '100vh',
    margin: 0,
  },
  header: {
    backgroundColor: '#0052cc',
    color: 'white',
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  title: {
    margin: 0,
    fontWeight: '700',
    fontSize: '1.8rem',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.6rem 1.2rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  movieGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
    gap: '1.5rem',
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  movieCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    outline: 'none',
  },
  movieCardHoverFocus: {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  },
  movieTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#222',
  },
  movieYear: {
    fontWeight: '400',
    color: '#777',
    fontSize: '1rem',
  },
  movieGenre: {
    margin: '0 0 0.8rem 0',
    fontSize: '1rem',
    color: '#555',
  },
  movieDuration: {
    fontSize: '0.9rem',
    color: '#888',
  },
  noMovies: {
    fontSize: '1.2rem',
    color: '#777',
    textAlign: 'center',
    gridColumn: '1 / -1',
  },
};

export default App;