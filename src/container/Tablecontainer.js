import React, { useState, useEffect } from 'react';
import Usertable from '../component/UserTable'
import Eventtable from '../component/EventTable'
import { userColumns } from '../data/Userdata';
import { eventColumns } from '../data/EventData';
import { Container, Box } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
function Tablecontainer(props) {
	const { usersList, eventsList } = props;
	const [tableobj, setTableObj] = useState({
		usersListData: usersList,
		eventsListDate: eventsList,
		searchFilterValue: ''
	});
	useEffect(() => {
		setTableObj({
			...tableobj,
			usersListData: usersList,
			eventsListDate: eventsList,
		})

	}, [usersList, eventsList]);
	const handleTableSearch = (value, tableTitle) => {
		let searcheddata = value;
		let user_ids_event = [];
		let user_ids_user = [];
		let filterData = [];
		let flag = false;
		let userFilterData = [];
		let regex = new RegExp(searcheddata, 'gi');
		if (tableTitle === "User List") {
			userFilterData = usersList.filter((value) => {
				flag = value.name.match(regex)
				if (flag) {
					user_ids_user.push(value.index);
					return true;
				} else {
					return false;
				}
			});
			filterData = eventsList;

			if (userFilterData) {
				filterData = filterData.filter((value) => {
					const ids_length = value.registerd_user.length;
					flag = false;
					for (let i = 0; i < ids_length; i++) {
						flag = user_ids_user.includes(value.registerd_user[i]);
						if (flag) break;
					}
					return flag;
				});
			}
		} else {
			filterData = eventsList.filter((value) => {
				flag = value.organizer.match(regex)
				if (flag) {
					user_ids_event = [...new Set([...user_ids_event, ...value.registerd_user])];
					return true;
				} else {
					return false;
				}
			});
			if (filterData) {
				userFilterData = usersList.filter((element) => {
					return user_ids_event.includes(element.index);
				});
			}
		}
		setTableObj({ ...tableobj, usersListData: userFilterData, eventsListDate: filterData, searchFilterValue: value });

	}

	return (
		<Container>
			<Box my={2}>
				<Usertable columns={userColumns} title={'User List'}
					handleDeleteSelectedRows={props.deleteUserSelectedRows}
					handleTablseSearch={handleTableSearch}
					tableData={tableobj.usersListData}
					eventDataList={tableobj.eventsListDate}
				/>

				<Eventtable columns={eventColumns} title={'Event List'}
					handleDeleteSelectedRows={props.deleteEventSelectedRows}
					handleTablseSearch={handleTableSearch}
					handleIsShowOnCalander={props.handleIsShowOnCalander}
					tableData={tableobj.eventsListDate}
				/>

			</Box>
		</Container>
	);
}
const mapStateToProps = (state) => {
	return {
		eventsList: state.eventsList,
		usersList: state.usersList
	}
}
const mapDispachToProps = (dispatch) => {
	return {
		deleteUserSelectedRows: (seletedRowIds) => {
			dispatch({ type: "delete_user_data", data: seletedRowIds })
		},
		handleIsShowOnCalander: (row_id) => {
			dispatch({ type: "set_isShowOnCalander", data: row_id })
		},
		deleteEventSelectedRows: (seletedRowIds) => {
			dispatch({ type: "delete_event_data", data: seletedRowIds })
		},
		handleEventTableSearch: (searcheddata) => {
			dispatch({ type: "search_user_tables_data", data: searcheddata })
		},
		handleUserTableSearch: (searcheddata) => {
			dispatch({ type: "search_user_tables_data", data: searcheddata })
		}
	}
}
Tablecontainer.propTypes = {
	eventsList: PropTypes.array.isRequired,
	deleteEventSelectedRows: PropTypes.func.isRequired,
	handleIsShowOnCalander: PropTypes.func.isRequired,
	usersList: PropTypes.array.isRequired,
	deleteUserSelectedRows: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispachToProps)(Tablecontainer);;