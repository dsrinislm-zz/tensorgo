import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import { Outlet } from 'react-router-dom-next';
import Navbar from './Navbar';
import Box from '@material-ui/core/Box';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: '6rem',
    right: theme.spacing(2),
    zIndex: 9999,
  },
  menuBar: {
    top: 'auto',
    bottom: 0,
  },
}));
function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (
      event.target.ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <div
        onClick={handleClick}
        role="presentation"
        className={classes.root}
      >
        {children}
      </div>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const Layout = (props) => {
  const classes = useStyles();
  const { title , navbar } = props;
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Box className="title" component="h2"><BubbleChartIcon style={{marginRight:"10px"}} />{title}</Box>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Container>
          <Outlet />
      </Container>
      <ScrollTop {...props}>
        <Fab
          color="secondary"
          size="small"
          aria-label="scroll back to top"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
      {navbar ? (<AppBar
        position="fixed"
        color="primary"
        className={classes.menuBar}
      >
        <Navbar />
      </AppBar>):''}
    </React.Fragment>
  );
};

export default Layout;
