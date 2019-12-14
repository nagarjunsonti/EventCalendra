import React, { useState } from 'react';
import TableWidget from '../widgets/TableWidget';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { eventColumns } from '../data/EventData';
function AddEventsTable(props) {
  const { eventsList, addUserData } = props;
  const [tableData, setTableData] = useState(eventsList);
  const getFilterdata = (eventsList) => {
    let data = eventsList.filter((element) => {
      return (element.registerd_user.length < element.capacity);
    });
    return data;
  }
  const filterdata = getFilterdata(eventsList);

  const toolbarConfig = {
    title: "Add Events",
    icon: "add"
  }
  const addSelectedRows = (data) => {
    let selecteddataList = data;
    props.updateEventsSelectedRows({ userData: addUserData, eventsId: selecteddataList });
  }
  const handleTableSearch = (value) => {
    let searcheddata = value;
    let regex = new RegExp(searcheddata, 'gi');
    let filterData = eventsList.filter((value) => {
      return value.organizer.match(regex);
    });
    setTableData(filterData)
  }
  return (
    <React.Fragment>
      <TableWidget
        rows={tableData}
        defaultSort='name'
        columns={eventColumns}
        tableTitle={"Add Evvents"}
        handleToolBarAction={addSelectedRows}
        toolbarConfig={toolbarConfig}
        handleTableSearch={handleTableSearch}
        searchPlaceholder="Search By Organizer"
      />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    eventsList: state.eventsList
  }
}
const mapDispachToProps = (dispatch) => {
  return {
    updateEventsSelectedRows: (data) => {
      dispatch({ type: "add_event_data", data: data })
    }
  }
}
AddEventsTable.propTypes = {
  eventsList: PropTypes.array.isRequired
}
export default connect(mapStateToProps, mapDispachToProps)(AddEventsTable);