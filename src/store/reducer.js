const initialState = {
  usersList: [],
  eventsList: []
}

const reducer = (state = initialState, action) => {
  let newState = { ...state };
  let filterData = "";
  let userFilterData = "";

  switch (action.type) {
    case "get_user_event_data":
      newState = {
        ...state,
        usersList: action.data[0].UserRows,
        eventsList: action.data[1].EventRows
      };
      return newState;
    case "delete_user_data":

      userFilterData = state.usersList.filter((value) => {
        return (!action.data.includes(value.index))
      });

      filterData = state.eventsList;
      filterData.forEach((element) => {
        action.data.forEach((value) => {
          let valueindex = element.registerd_user.indexOf(value);
          if (valueindex !== -1) {
            element.registerd_user.splice(valueindex, 1);
          }
        });
      })
      newState = {
        ...state,
        usersList: userFilterData,
        eventsList: filterData
      };
      return newState;
    case "delete_event_data":

      let user_ids_event_list = [];

      filterData = state.eventsList.filter((value) => {
        if (action.data.includes(value.index)) {
          //user_ids_event_list= [...new Set([...user_ids_event_list, ...value.registerd_user])];
          user_ids_event_list = user_ids_event_list.concat(value.registerd_user);
          return false;
        }
        return true;
      });
      userFilterData = state.usersList;
      userFilterData.forEach((element) => {
        if (user_ids_event_list.includes(element.index)) {
          let matchedValues = user_ids_event_list.filter((value) => { return value === element.index });
          element.registeredevents = (element.registeredevents !== 0) ? (element.registeredevents - matchedValues.length) : 0;
        }
      })
      newState = {
        ...state,
        usersList: userFilterData,
        eventsList: filterData
      };
      return newState;
    case "set_isShowOnCalander":
      filterData = state.eventsList.map((value) => {
        if (value.index === action.data) {
          value.isShowOnCalander = !value.isShowOnCalander;
        }
        return value;
      });
      newState = {
        ...state,
        eventsList: filterData
      };
      return newState;
    case "add_event_data":
      let selectedEvents = action.data.eventsId;
      let selectedUser = action.data.userData;
      userFilterData = state.usersList;
      let selectedEventsLength = selectedEvents.length;

      filterData = state.eventsList.map((value) => {
        if (selectedEvents.includes(value.index)) {
          value.registerd_user.push(selectedUser.index);
        }
        return value;
      });
      userFilterData.forEach((value) => {
        if (value.index === selectedUser[0].index) {
          value.registeredevents = value.registeredevents + selectedEventsLength;
        }
      });
      newState = {
        ...state,
        eventsList: filterData,
        usersList: userFilterData
      };
      return newState;
    default:
      return newState;
  }
}
export default reducer