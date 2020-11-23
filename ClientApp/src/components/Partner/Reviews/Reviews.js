import React from 'react';
import { Container } from 'reactstrap';
import { Redirect, useRouteMatch, Link } from "react-router-dom";
import './Reviews.css';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';
import { Pagination } from '@material-ui/lab';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function Reviews() {

   // let { path } = useRouteMatch();
    const classes = useStyles();




    return (
        <div className='container reviews-content'>
            <div className='row'>
                <div className='col-12'>
                </div>
                <div className='col-12'>
                    <TableContainer component={Paper}>
                        <Table className={classes.table}  aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Reaction</TableCell>
                                    <TableCell align="right">Auteur</TableCell>
                                    <TableCell align="right">Note</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                    <TableCell align="right">Photo (s)</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.text}
                                        </TableCell>
                                        <TableCell align="right">{row.author}</TableCell>
                                        <TableCell align="right"><Rating
                                            name="read-only"
                                            value={row.rating}
                                            precision={0.5}
                                            readOnly
                                            
                                        /></TableCell>
                                        <TableCell align="right">{row.date}</TableCell>
                                        <TableCell align="right"><div className='row justify-content-end'>{

                                            row.photos.map((pic, i) => (<Link to={pic.url}>
                                            <div className='photo-hightlight' style={{ backgroundImage: `url(${pic.path})` }}>
                                            </div>
                                        </Link>))

                                        }</div></TableCell>
                                        <TableCell align="right"><Button variant="contained" color="default" >Repondre</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <div className='row reviews-table-pagination'>
                <div className='col-12 col-md-8 col-lg-6 col-xl-6' >
                    <Pagination count={10} shape="rounded" />
                </div>
            </div>
        </div>);
}



function createData(text, author, rating, date, photos) {
    return { text, author, rating, date, photos };
}

const rows = [
    createData('Frozen yoghurt', 'Jeanette doe ', 5, '10/09/2020', [{ path: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', url: 'reviews/img/1' }, { path: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', url: 'reviews/img/2' }]),
    createData('Ice cream sandwich', 'Jeanette doe ', 3, 'Hier, a 10:30', [{ path: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', url: 'reviews/img/2' }]),
    createData('Eclair', 'Jeanette doe ', 3.5, 'Auj, a 17:44', [{ path: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', url: 'reviews/img/3' }, { path: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', url: 'reviews/img/2' } ]),
    createData('Cupcake', 'Jeanette doe ', 4, '10/09/2020', [{ path: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', url: 'reviews/img/1' }, { path: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', url: 'reviews/img/2' } ]),
    createData('Gingerbread', 'Jeanette doe ', 4.5, '20/12/2019', [{ path: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', url: 'reviews/img/1' }, { path: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', url: 'reviews/img/2' } ]),
];