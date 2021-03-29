import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import {
  useLocation
} from "react-router-dom-next";
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setQueryUsers,
  setQueryInProgress
} from '../redux/actions';
import { Collapse } from '@material-ui/core';
const mapStatesToProps = (state) => ({
  loading: state.usersReducer.query_in_progress,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      dispatchSetUsers: setQueryUsers,
      dispatchQueryInProgress: setQueryInProgress,
    },
    dispatch
  );
const ApiSync = (props) => {
  const {dispatchSetUsers, dispatchQueryInProgress,loading} = props;
  const location = useLocation();
  const [usersCount, setUsersCount] = useState(0);
  const [closeAlert, setCloseAlert] = React.useState(false);
  useEffect(() => {
    dispatchQueryInProgress(true);
    fetch(process.env.REACT_APP_WP_URL + process.env.REACT_APP_API_PATH+location.pathname)
      .then((res) => res.json())
      .then((res) => {
        dispatchQueryInProgress(false);
        setUsersCount(res.usersCount,setCloseAlert(true, dispatchSetUsers({users:res.users})));
        setTimeout(function(){ setCloseAlert(false) }, 4000);
      });
  }, [location.pathname]);  
  return loading ? (
        <Box className="fixed-alert hide-transparent">
              <Box style={{margin:".8rem 0rem"}}><h4 style={{padding:"0rem 1.5rem"}}>Fetching users form GoRest API service...</h4></Box>
              <LinearProgress color="secondary" />
          </Box>
        ) : (
          <Collapse in={closeAlert} timeout={800}>
          <Box className="fixed-alert">
            <Alert severity="success" onClose={() => {setCloseAlert(false)}}><Box component="h4" m={0}>Users sync completed sucessfully!!! {usersCount> 0 ? ` ( Number of received users: ${usersCount} )` : ''}</Box></Alert>
            </Box></Collapse>)
};
export default connect(
  mapStatesToProps,
  mapDispatchToProps
)(ApiSync);
