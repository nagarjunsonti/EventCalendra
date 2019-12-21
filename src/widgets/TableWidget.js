import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityTwoToneIcon from '@material-ui/icons/VisibilityTwoTone';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Switch from '@material-ui/core/Switch';
import moment from "moment";
import TextField from '@material-ui/core/TextField';
function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columns, actionColumn } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };


  const getTableHeaderCell = (headCell) => {
    if (headCell.sortFlag) {
      return (
        <TableSortLabel
          active={orderBy === headCell.key_id}
          direction={order}
          onClick={createSortHandler(headCell.key_id)}
        >
          {headCell.label}
          {orderBy === headCell.key_id ? (
            <span className={classes.visuallyHidden}>
              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
            </span>
          ) : null}
        </TableSortLabel>
      );
    } else {
      return (<div>{headCell.label} </div>)
    }
  }
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {columns.map(headCell => (
          <TableCell
            key={headCell.key_id}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.key_id ? order : false}
          >
            {getTableHeaderCell(headCell)}
          </TableCell>
        ))}
        {(actionColumn) && <TableCell >Event Actions </TableCell>}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected, tableTitle, checkBoxSelected, toolbarConfig, handleTableSearch, searchPlaceholder,searchFilterValue, showAllEvents} = props;
  const toolBartitle=(toolbarConfig)?toolbarConfig.title:"Delete";
  const seetToolBarAction = () => {
    const selectedRows = checkBoxSelected;
    props.handleToolBarAction(selectedRows);
    props.handleSelectAllClick();
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle">
            {tableTitle}
          </Typography>
        )}

      {numSelected > 0 ? (
        <Tooltip title={toolBartitle}>
          <IconButton aria-label={"toolBartitle"} onClick={() => { seetToolBarAction() }}>
            {(toolbarConfig && toolbarConfig.icon === "add")?<AddCircleOutlineIcon />:<DeleteIcon />}
          </IconButton>
        </Tooltip>
      ) : (
          <div className={"tableToolbarIconDiv"}>
          <TextField  placeholder={searchPlaceholder} onChange={(e)=>handleTableSearch(e.target.value, tableTitle)} value={searchFilterValue}/>
            {
              (tableTitle !== "Add Evvents")?(
                  <Tooltip title="View All Events">
                    <IconButton aria-label="View All Events" onClick={(e)=>showAllEvents()}>
                      <VisibilityTwoToneIcon />
                    </IconButton>
                
                  </Tooltip>):""
              
            }
            
            
          </div>
        )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableTitle: PropTypes.string.isRequired,
  checkBoxSelected: PropTypes.array
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable(props) {  
  const { rows, columns, tableTitle, defaultSort, toolbarConfig } = props;
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(defaultSort);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event && event.target.checked) {
      const newSelecteds = rows.map(n => n.index);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCheckBoxClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const getFormatDate = (date) => {
    let formateDate = moment(date).format("DD-MM-YYYY h:mm a");
    return formateDate;
  }
  const getTableCell = (row, labelId) => {
    let columnsList = columns;
    return columnsList.map((column) => {
      let columnData = row[column.key_id];
      if (column.key_id === "scheduledfor") {
        columnData = getFormatDate(row[column.key_id]);
      }
      return <TableCell key={row[column.key_id]} component="th" align={column.numeric ? 'center' : 'left'} scope="row" padding="none">
        {columnData}
      </TableCell>
    })
  }  
  const getIconComponent = (row, action) => {
    let disabledButton = (row.isShowOnCalander && row.isShowOnCalander) ? true : false;
    switch (action.icon) {
      case 'view':
        return (<IconButton disabled={disabledButton} aria-label={action.title} onClick={() => { action.callBack(row) }}>
          <VisibilityTwoToneIcon />
        </IconButton>)
      case 'add':
        return (<IconButton disabled={disabledButton} aria-label={action.title} onClick={() => { action.callBack(row) }}>
          <AddCircleOutlineIcon />
        </IconButton>)
      case 'delete':
        return (<IconButton disabled={disabledButton} aria-label={action.title} onClick={() => { action.callBack(row) }}>
          <DeleteIcon />
        </IconButton>)
      case 'switch':
        return (<IconButton aria-label={action.title}>
          <Switch checked={row.isShowOnCalander} onChange={() => { props.handleEventDisplayToggle(row.index) }} value={true} />
        </IconButton>)
      default:
        return (<IconButton aria-label={action.title}>
          <VisibilityTwoToneIcon />
        </IconButton>)
    }

  }

  const getActionTableCell = (labelId, row) => {
    return (
      <TableCell component="th" align='center' id={labelId} scope="row" padding="none" >
        <div className={"actionLinks"}>
          {props.actionColumn.map((action) => {
            return (
              <Tooltip title={action.title} key={Math.random()}>
                {getIconComponent(row, action)}
              </Tooltip>
              // <Link component="button"
              //   variant="body2"
              //   onClick={() => {action.callBack(row);}}
              // >
              //   <Tooltip title={action.title}>
              //     <IconButton aria-label={action.title}>
              //       {getIconComponent(row,action.icon)}
              //     </IconButton>
              //   </Tooltip>
              // </Link>
            )
          })}
        </div>
      </TableCell>
    )
  }
  const isSelected = index => selected.indexOf(index) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} toolbarConfig={toolbarConfig} tableTitle={tableTitle} checkBoxSelected={selected} handleToolBarAction={props.handleToolBarAction} handleSelectAllClick={handleSelectAllClick}  handleTableSearch={props.handleTableSearch } showAllEvents={props.showAllEvents} searchPlaceholder={props.searchPlaceholder}  />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              key={Math.random()}
              columns={columns}
              actionColumn={props.actionColumn}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.index);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      // onClick={event => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={event => handleCheckBoxClick(event, row.index)}
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                          key={Math.random()}
                        />
                      </TableCell>
                      {getTableCell(row, labelId)}
                      {(props.actionColumn) && getActionTableCell(labelId, row)}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
