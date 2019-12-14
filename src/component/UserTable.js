import React, {useState} from 'react';
import TableWidget from '../widgets/TableWidget';
import SideBarcomponent from './SideBarcomponent';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

function Usertable(props) {

  const { title, columns, tableData} = props;

  const [modelData, setModelData]=useState({
    modelOpen:false,
    calanderDataList:tableData,
    showAddTable:false,
    searchFilterValue:"",
    sideBarTitle:"All"
  });  
    const getEventListData=(user_idex)=>{
      let eventslist=props.eventsList;
      
     return eventslist.filter((element)=>{
        return element.registerd_user.includes(user_idex);
      });

    }
    const handleClickModelOpen=(data, showAll=false)=>{
      debugger;
      console.log(data);
      let sideBarTitle=modelData.sideBarTitle;
       let popupData=(data.length)?data:[data];       
      if(!showAll){
        popupData=getEventListData(data.index);
        sideBarTitle=data.name;
      }
      //let popupData=getEventListData(data.index);      
      setModelData({modelOpen:true,calanderDataList:popupData, sideBarTitle:sideBarTitle});
    }
    const handleClickModelClose=(data)=>{
      console.log(data);
      setModelData({...modelData, modelOpen:false, showAddTable:false});
    }
    const handleClicAddEvents=(data)=>{
      console.log(data);
      let popupData=[data];
      let sideBarTitle=`${data.name} Add`;
      setModelData({modelOpen:true,calanderDataList:popupData,showAddTable:true, sideBarTitle:sideBarTitle});
    }
    // handleTableSearch = (searchedData) => {
      
    // }
    // const deleteSelectedRows=(seletedRowIds)=>{
    //   let filterData=usersList.filter((value)=>{
    //       return (!seletedRowIds.includes(value.user_index))
    //   });

    // }
  const showAllEvents=()=>{
    handleClickModelOpen(props.eventDataList, true);
    //setModelData({...modelData, calanderDataList:tableData,modelOpen:true});
  }
  const actionColumn = [
    {
      title: "View events",
      // handleViewAction:{handleClickModelClose}
      callBack:handleClickModelOpen,
      icon:"view"
    },
    {
      title: "Add Events",
      //handleAddAction:{handleClickModelClose}
      callBack:handleClicAddEvents,
      icon:"add"
    }    
  ];
  const {modelOpen, calanderDataList, showAddTable, searchFilterValue, sideBarTitle}=modelData;
  return (
    <React.Fragment>
      <TableWidget
        rows={tableData}
        defaultSort='name'
        columns={columns}
        tableTitle={title}
        showAllEvents={showAllEvents}
        handleToolBarAction={props.handleDeleteSelectedRows}
        actionColumn={actionColumn}
        handleTableSearch={props.handleTablseSearch} 
        searchPlaceholder="Search By Name"
        searchFilterValue={searchFilterValue} 
      />
      <SideBarcomponent 
                    modelOpen={modelOpen}                    
                    closeModelClick={handleClickModelClose}
                    calanderDataList={calanderDataList}
                    sideBarTitle={sideBarTitle}
                    showAddTable={showAddTable}
            />
    </React.Fragment>
  );
}

const mapStateToProps=(state)=>{
  return {
    eventsList:state.eventsList    
  }
}

Usertable.propTypes={
  title:PropTypes.string.isRequired,
  columns:PropTypes.array.isRequired,
  tableData:PropTypes.array.isRequired,
  handleDeleteSelectedRows:PropTypes.func.isRequired  
}
export default connect(mapStateToProps)(Usertable)