import React, { useState, useEffect } from 'react';
import TableWidget from '../widgets/TableWidget';
import SideBarcomponent from './SideBarcomponent';
import PropTypes from 'prop-types';

function Eventtable(props) {
  let { title, columns, tableData } = props;

  let [modelData, setModelData] = useState({
    modelOpen: false,
    calanderDataList: tableData,
    showAddTable: false,
    searchFilterValue: "",
    sideBarTitle: "All"
  });

  useEffect(() => {
    setModelData({
      ...modelData,
      calanderDataList: tableData
    })

  }, [tableData])
  const handleClickModelOpen = (data, showAll = false) => {
    let popupData = (data.length) ? data : [data];
    let sideBarTitle = (showAll) ? "All" : data.organizer;
    setModelData({ modelOpen: true, calanderDataList: popupData, sideBarTitle: sideBarTitle });

  }
  const handleClickModelClose = (data) => {
    setModelData({ ...modelData, modelOpen: false, showAddTable: false });
  }
  const showAllEvents = () => {
    handleClickModelOpen(tableData, true);
  }
  const actionColumn = [
    {
      title: "View event",
      callBack: handleClickModelOpen,
      icon: "view"
    },
    {
      title: "Hide event on calander",
      icon: "switch"
    }
  ];
  const { modelOpen, calanderDataList, searchFilterValue, sideBarTitle } = modelData;

  return (
    <React.Fragment>
      <TableWidget
        rows={tableData}
        defaultSort='name'
        columns={columns}
        tableTitle={title}
        actionColumn={actionColumn}
        openModelClick={handleClickModelOpen}
        handleToolBarAction={props.handleDeleteSelectedRows}
        handleEventDisplayToggle={props.handleIsShowOnCalander}
        handleTableSearch={props.handleTablseSearch}
        searchPlaceholder="Search By Organizer"
        searchFilterValue={searchFilterValue}
        showAllEvents={showAllEvents}
      />
      <SideBarcomponent
        modelOpen={modelOpen}
        closeModelClick={handleClickModelClose}
        sideBarTitle={sideBarTitle}
        calanderDataList={calanderDataList}
      />
    </React.Fragment>
  );
}
Eventtable.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  handleDeleteSelectedRows: PropTypes.func.isRequired,
  handleIsShowOnCalander: PropTypes.func.isRequired
}
export default Eventtable;