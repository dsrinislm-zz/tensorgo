import React,{useState, useEffect} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setCurrentUser,
  setQueryUsers,
} from '../redux/actions';
import { useParams, useNavigate } from 'react-router';
const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);
const useStyles = makeStyles((theme) => ({
  root: {
    display:'flex',
    justifyContent:'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  container: {
    width:"100%",
  },
  pointer:{
    cursor:'pointer',
    padding: "2px 4px!important"
  }
}));
const mapStatesToProps = (state) => ({
  currentUser: state.usersReducer.current_user,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      dispatchSetCurrentUser: setCurrentUser,
      dispatchSetUsers: setQueryUsers,
    },
    dispatch
  );
const EditUser = (props) => {
  const {currentUser, dispatchSetCurrentUser,dispatchSetUsers} = props;
  const classes = useStyles();
  const params = useParams();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState({
    type:'error',
    message:'',
    open:false
  });
  const [name, setName] = useState(currentUser?currentUser.name:'');
  const [email, setEmail] = useState(currentUser?currentUser.email:'');
  const [gender, setGender] = useState(currentUser?currentUser.gender:'');
  const [status, setStatus] = useState(currentUser?(currentUser.status == 'Active') ? true: false :false);
  useEffect(() => {
    if(currentUser === null){
        fetch(process.env.REACT_APP_WP_URL + process.env.REACT_APP_API_PATH+ '/user/'+params.id)
          .then((res) => res.json())
          .then((res) => {
            if(res.user){
              setName(res.user.name);
              setEmail(res.user.email);
              setGender(res.user.gender);
              setStatus(res.user.status == 'Active' ? true : false);
              dispatchSetCurrentUser(res.user);
            }
          });
    }
  }, [currentUser, params.id]);
  const handleCloseAlert =  (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertMessage({...alertMessage, open:false})
  };
  const saveUser = (event) =>{
    event.preventDefault();
    const user = {
      name, email, gender, status
    };
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    }
    fetch(process.env.REACT_APP_WP_URL + process.env.REACT_APP_API_PATH+ '/user/'+params.id, requestOptions)
        .then(response => response.json())
        .then(data => {
          setAlertMessage({type:data.status,message:data.message, open:true})
          if(data.status==='success'){
            dispatchSetUsers({
              updateUser: data.user
            })
            setTimeout(()=>navigate("/"), 1500)
          }
        });
  }
  
  return (
    <form className={classes.root} autoComplete="off" onSubmitCapture ={(event)=>saveUser(event)}>
      <Snackbar open={alertMessage.open} autoHideDuration={5000} onClose={handleCloseAlert}  anchorOrigin={{vertical: 'top', horizontal: 'center' }}>
        <Alert style={{fontWeight:"bold"}} onClose={handleCloseAlert} severity={alertMessage.type}>
          {alertMessage.message}
        </Alert>
      </Snackbar>
      <Box pb={3} pt={4} className={classes.container} >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
                  className={classes.container}
                  label="Name"
                  value={name}
                  required
                  onChange={(event)=>setName(event.target.value)}
                  variant="outlined"
                />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
                  label="Email"
                  className={classes.container}
                  value={email}
                  required
                  onChange={(event)=> setEmail(event.target.value)}
                  variant="outlined"
                />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl variant="outlined"  className={classes.container}>
              <InputLabel>Gender *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={gender}
                onChange={(event)=> setGender(event.target.value)}
                label="Gender *"
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Transgender">Transgender</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl variant="outlined"  className={classes.container}>
              <InputLabel>Status *</InputLabel>
              <Select
                value={status ? 'Active': 'InActive'}
                label="Status *"
                required
              >
                <MenuItem value={status? 'Active': 'InActive'} selected={true}>{status? 'Active': 'InActive'}</MenuItem>
                <Typography component="div" className="MuiSelect-root MuiSelect-outlined MuiOutlinedInput-input">
                  <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item className={classes.pointer}>InActive</Grid>
                    <Grid item>
                      <AntSwitch label="Status" checked={status} onChange={()=> {setStatus(!status)}}/>
                    </Grid>
                    <Grid item className={classes.pointer}>Active</Grid>
                  </Grid>
                </Typography>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} style={{display:'flex',justifyContent: 'space-between'}}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              className={classes.button}
              startIcon={<ArrowBackIcon />}
              onClick={()=>navigate("/")}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<SaveIcon />}
              type="submit"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};


export default connect(
  mapStatesToProps,
  mapDispatchToProps
)(EditUser);
