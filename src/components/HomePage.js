import React from 'react';
import classes from './styles/Homepage.module.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className={classes.pageContainer}>
      <div className={classes.container}>
        <div className={classes['inner-container']}>
          <h3 className={classes.quote}>Its Time to Prevent TB to End TB!!</h3>
          <Link to='/get-started'>
            <button className={classes.primary}>
              Get Started
            </button>
          </Link>
        </div>
      </div>

      <footer className={classes.footer}>
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
