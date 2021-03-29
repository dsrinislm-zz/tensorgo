import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import { useNavigate } from 'react-router';
import { bindActionCreators } from 'redux';
import {
  setCurrentUser,
} from '../redux/actions';
import { connect } from 'react-redux';
const columns = [
  { id: 'id', label: 'User Id' },
  { id: 'name', label: 'Name'},
  { id: 'email', label: 'Email' },
  {
    id: 'gender',
    label: 'Gender',
  },
  {
    id: 'status',
    label: 'Status',
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
  },
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      dispatchSetCurrentUser: setCurrentUser,
    },
    dispatch
  );

const ListTable = (props) => {
  const {rows, queryProgess, dispatchSetCurrentUser} = props;
  const navigate = useNavigate();
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  return rows.length ? (
      <Paper className={classes.root}>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        /> 
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                            <TableCell onClick={()=>{dispatchSetCurrentUser(row); navigate(`/user/edit/${row.id}`)}} key={column.id} align={column.align} className="table-cell">
                              {column.format && typeof value === 'number' ? column.format(value) : value}
                            </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
    </Paper>
  )
  : !queryProgess && rows.length == 0 ? 
  (<Box className="fixed-alert">
    <Alert severity="warning" className="page-alert"><Box component="h4" m={0}>Users not availabe, please sync users by "Refresh Sync" or "Sync New Users" options</Box></Alert>
  </Box>) : '';
};
export default connect(
  null,
  mapDispatchToProps
)(ListTable);