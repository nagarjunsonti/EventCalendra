import React, {useEffect} from 'react';
import {AppBar, Toolbar,Typography,CssBaseline, Container, Box} from '@material-ui/core';
import imgLogo from './images/spectrum_logo.png';
import TableContainer from './container/Tablecontainer'
import './App.css';
import UserRows from './data/Userdata';
import EventRows from './data/EventData';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

function App(props) {
  //@getUserData call API for get userdata
  const getUserData=()=>{
    return {UserRows}
  }
  
  //@geteventData call API for get eventdata
  const geteventData=()=>{
    return {EventRows}
  }
  useEffect(()=>{
     const userdata=new Promise((resolve)=>{
        resolve(getUserData());
     });
     const eventdata=new Promise((resolve)=>{
       resolve(geteventData());
    });

     Promise.all([userdata,eventdata]).then(values=>{
       console.log(values[0]);
        props.updateUserEventdata(values);
     }).catch((error)=>{
        console.log(error)
     });
  },[])
  return (
    <div className="App">
    <CssBaseline />
    <AppBar>
      <Toolbar>                  
        <img src={imgLogo} alt="spectrum global" with="50px" height="50px" />
        <Typography variant="h6" paddingleft={10}>Spectrum Global Events Calender</Typography>
      </Toolbar>
    </AppBar>
    <Toolbar />
    <Container>
      <Box my={2}>{                    
            <TableContainer/>                
        }
      </Box>
    </Container>    
  </div>
  );
}

const mapStateToProps=(state)=>{
  return {
          usersList:state.usersList,
          eventsList:state.eventsList
        }
}
const mapDispachToProps =(dispatch)=>{
  return {
    updateUserEventdata:(responseData)=>{
      dispatch({type:"get_user_event_data", data:responseData})
    }
  }
} 
App.propTypes={  
  usersList:PropTypes.array,
  eventsList:PropTypes.array 
}

export default connect(mapStateToProps,mapDispachToProps)(App);
