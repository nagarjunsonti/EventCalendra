import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { CssBaseline, Container, Box } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from "moment";
import AddEventsTable from './AddEventsTable'
import "react-big-calendar/lib/css/react-big-calendar.css";
import './sidebarCss.css';
import Modal from '@material-ui/core/Modal';
import { connect } from 'react-redux';
const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    flexDirection: 'rowReverse'
  },
  paper: {
    position: 'absolute',
    width: 550,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const localizer = momentLocalizer(moment)
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function SideBarcomponent(props) {
  const { modelOpen, calanderDataList, closeModelClick, showAddTable } = props;
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [eventModelObj, seteventModelObj] = useState({
    eventModelOpen: false,
    eventModeltitle: "",
    data: {}
  });
  let eventsArrayList = [];
  if (calanderDataList && calanderDataList.length) {

    calanderDataList.forEach(element => {
      if (!element.isShowOnCalander) {
        let data = {
          id: element.index,
          start: moment(element.scheduledfor).toDate(),
          end: moment(element.endScheduar).toDate(),
          eventClasses: 'optionalEvent',
          title: element.organizer,
          description: element.about,
          orginalData: element
        }
        eventsArrayList.push(data);
      }
    });
  }
  const getRegisteredusers = (registerd_user) => {
    let usersList = props.usersList;
    let usersName = [];
    usersList.forEach((element) => {
      if (registerd_user.includes(element.index)) {
        usersName.push(element.name);
      }
    })

    return usersName;
  }
  const getFormatDate = (date) => {
    let formateDate = moment(date).format("DD-MM-YYYY h:mm a");
    return formateDate;
  }
  const handleEventModelOpen = (data) => {

    seteventModelObj({
      ...eventModelObj,
      eventModelOpen: true,
      eventModeltitle: data.title,
      data: {
        startTime: getFormatDate(data.start),
        entTime: getFormatDate(data.end),
        description: data.description,
        organizer: data.orginalData.organizer,
        company: data.orginalData.company,
        usersList: getRegisteredusers(data.orginalData.registerd_user)
      }
    });
  };
  const handleEventModelClose = () => {
    seteventModelObj({ ...eventModelObj, eventModelOpen: false });
  };
  const handleEventSelectEvent = (data) => {
    handleEventModelOpen(data);
  }

  const getEventModelUsersContent = () => {
    let content = <li> "No Users are registered for this event" </li>;
    if (eventModelObj.data.usersList) {
      content = eventModelObj.data.usersList.map((user) =>
        <li key={user + "_id"}>
          {user}
        </li>
      );
    }

    return content;

  }
  return (
    <div>
      <Dialog fullScreen open={modelOpen} onClose={closeModelClick} TransitionComponent={Transition}>
        <div className={'sidebarHeaderDiv'}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <div className={'sideBarTitleDiv'}><h2>{`${props.sideBarTitle} events`}</h2></div>
              <div className={"closeButtonDiv"}>
                <IconButton edge="start" color="inherit" onClick={closeModelClick} aria-label="close">
                  <CloseIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
        </div>
        <CssBaseline />
        <Container>
          <Box my={2}>
            <div className={"sidebarContainer"}>
              {(showAddTable) ? <AddEventsTable addUserData={calanderDataList} /> : <Calendar
                localizer={localizer}
                defaultDate={new Date()}
                defaultView="month"
                events={eventsArrayList}
                style={{ height: "80vh" }}
                onSelectEvent={event => handleEventSelectEvent(event)}
                onSelectSlot={handleEventSelectEvent}
              />}
            </div>
          </Box>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={eventModelObj.eventModelOpen}
            onClose={handleEventModelClose}
          >
            <div style={modalStyle} className={classes.paper}>
              <h2 id="simple-modal-title">Event Details</h2>
              <div className="eventModelDescriptionContainer">
                <div className="descriptionHeader">
                  <div className={'childBlockDiv'}><span className="labelSpan">Organizer</span>: {eventModelObj.data.organizer} </div>
                  <div className={'childBlockDiv'}><span className="labelSpan">Company:</span> {eventModelObj.data.company}</div>
                </div>
                <div className="descriptionTimeSlopt">
                  <div className={'childBlockDiv'}><span className="labelSpan">Start Time: </span> {eventModelObj.data.startTime}</div>
                  <div className={'childBlockDiv'}><span className="labelSpan">End time:</span> {eventModelObj.data.entTime}</div>

                </div>
                <div className="descriptionDiv">
                  <div><span className="labelSpan">Description</span>: {eventModelObj.data.description}</div>
                </div>
                <div className="usersListDiv">
                  <span className="labelSpan">Registered users </span>
                  <ul>
                    {getEventModelUsersContent()}
                  </ul>

                </div>
              </div>
            </div>
          </Modal>
        </Container>
      </Dialog>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    usersList: state.usersList
  }
}
export default connect(mapStateToProps)(SideBarcomponent);