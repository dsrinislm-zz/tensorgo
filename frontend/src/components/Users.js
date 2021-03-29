import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import ListTable from './ListTable';
import { Outlet } from 'react-router-dom-next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Box from '@material-ui/core/Box';
import {
  setQueryUsers,
} from '../redux/actions';
import LinearProgress from '@material-ui/core/LinearProgress';
const mapStatesToProps = (state) => ({
  users: state.usersReducer.users,
  query_in_progress: state.usersReducer.query_in_progress,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      dispatchSetUsers: setQueryUsers,
    },
    dispatch
  );
const Users = (props) => {
  const {users, dispatchSetUsers, query_in_progress} = props;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if(location.pathname === '/' && users.length===0){
        setLoading(true);
        fetch(process.env.REACT_APP_WP_URL + process.env.REACT_APP_API_PATH+ '/users')
          .then((res) => res.json())
          .then((res) => {
            dispatchSetUsers({users:res})
            setLoading(false);
          });
    }
  }, [location.pathname]);
  return (
    <React.Fragment>
        {
          loading ? (
            <Box className="fixed-alert hide-transparent">
                  <Box style={{margin:".8rem 0rem"}}><h4 style={{padding:"0rem 1.5rem"}}>Fetching users form Database...</h4></Box>
                  <LinearProgress color="secondary" />
            </Box>
            ) :'' 
        }
        <Outlet/>
        <Box pt={4} mb={'80px'} css={{width:"100%"}}>
          <Grid item className="users-table">
            <ListTable rows={users} queryProgess={loading ? loading : query_in_progress}/>
          </Grid>
        </Box>
    </React.Fragment>
  )
};
export default connect(
  mapStatesToProps,
  mapDispatchToProps
)(Users);
