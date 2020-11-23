import React, { useState, useEffect } from 'react';
import { Container, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Redirect, useRouteMatch, Link } from "react-router-dom";
import { Button, CircularProgress, TextField, IconButton, FormControlLabel, Switch } from "@material-ui/core";
import './Gallery.css';
import { MdCameraEnhance } from 'react-icons/md';
import { Pagination } from '@material-ui/lab';
import authService from '../../api-authorization/AuthorizeService';
import { PostApi, GetApi } from '../../../api/ApiConstants';
import { FiCamera } from 'react-icons/fi';
import { useDataContext } from '../../Global/GlobalContext';

export default function Gallery(props) {

    let { path } = useRouteMatch();
    const [addPhotoModel, setAddPhotoModel] = useState({
        photo: null,
        title: null,
        hasPrice: false,
        price: null,
    });

    const [editPhotoModel, setEditPhotoModel] = useState({
        photoUrl: null,
        title: null,
        hasPrice: false,
        price: null,
        photoId: null,
    });
    const [model, setModel] = useState(null);
    const [canSubmitNew, setCanSubmitNew] = useState(false);
    const [canSubmitEdit, setCanSubmitEdit] = useState(false);
    const { dcReducer, dataContext} = useDataContext();
    const [modalAdd, setModalAdd] = useState(false);
    const toggleAdd = () => setModalAdd(!modalAdd);
    const [modalEdit, setModalEdit] = useState(false);
    const toggleEdit = () => setModalEdit(!modalEdit);
    const [pages, setPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [img, setImg] = useState('');

    useEffect(() => {

        dcReducer({ type: 'navigate-dashboard', data: { activeAccountLink: 'gallery' } });
        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                authService.getAccessToken().then(token => {

                    const data = {
                        userId: res.sub,
                        skip:0,
                    };

                    fetch(`${PostApi.OwnedPhotoAlbum}`, {
                        method: 'POST',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json', },
                        body: JSON.stringify(data),
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data != null && data != undefined) {
                                setModel(data);
                                setPage(data.pages);

                                setReady(true);
                            }
                                
                        });


                });

            }

        });

    }, []);


    const changePage = (event, value) => {

        var toSkip = 24 * (value - 1);

        var depthEnd = model.totalPhotos - toSkip;

        //check if can load more data forward
        if (value > currentPage && depthEnd <= 0) {
            return;
        }

        if (value === currentPage)
            return;
        
        setReady(false);

        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                authService.getAccessToken().then(token => {

                    const data = {
                        userId: res.sub,
                        skip: toSkip,
                    };

                    fetch(`${PostApi.OwnedPhotoAlbum}`, {
                        method: 'POST',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json', },
                        body: JSON.stringify(data),
                    })
                        .then(response => response.json())
                        .then(data => {

                            if (data != null && data != undefined) {
                                setModel(data);
                                setPage(data.pages);
                                setCurrentPage(value);
                                setReady(true);
                            }
                        });


                });

            }

        });
    }

    function sendNewData() {
        setLoading(true);

        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                var data = new FormData();
                data.append("userId", res.sub);
                data.append("photo", addPhotoModel.photo);
                data.append("title", addPhotoModel.title);
                data.append("hasPrice", addPhotoModel.hasPrice);
                data.append("price", addPhotoModel.price);

                authService.getAccessToken().then(token => {
                    fetch(PostApi.PostAddPhoto, {
                        method: 'POST',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
                        body: data,
                    })
                        .then(response => {
                            if (response.status === 200) {
                                setLoading(false);
                                props.openSuccess();
                            }
                            else {
                                setLoading(false);
                                props.openFailed();
                            }
                            toggleAdd(false);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });
            }
        });
    }

    function sendEditData() {
        setLoading(true);

        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {


                const data = {
                    userId: res.sub,
                    title: editPhotoModel.title,
                    hasPrice: editPhotoModel.hasPrice,
                    price: editPhotoModel.price,
                    photoId: editPhotoModel.photoId,
                };

                authService.getAccessToken().then(token => {
                    fetch(PostApi.PostEditPhoto, {
                        method: 'POST',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    })
                        .then(response => {
                            if (response.status === 200) {
                                setLoading(false);
                                props.openSuccess();
                            }
                            else {
                                setLoading(false);
                                props.openFailed();
                            }

                            toggleEdit(false);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });
            }
        });
    }

    function deleteData(id) {

        setLoading(true);

        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                authService.getAccessToken().then(token => {
                    fetch(`${GetApi.GetDeletePhoto}/${res.sub}/${id}`, {
                        method: 'GET',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    })
                        .then(response => {
                            if (response.status === 200) {
                                setLoading(false);
                                //props.openSuccess();
                                window.location.reload();
                            }
                            else {
                                setLoading(false);
                                props.openFailed();
                            }

                            toggleEdit(false);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });
            }
        });
    }

    function openEditor(img) {
       
        setEditPhotoModel(img);
        toggleEdit(true);
    }

    function PhotoCard(props) {

        return (<div className='col-6 col-md-4 col-lg-2 img-card-wrapper' >
            <div onClick={() => { openEditor(props.img); }} title={props.img.title} className='img-card' style={{ backgroundImage: `url('${props.img.photoUrl}')` }}>
            </div>
        </div>);
    }


    return (
        <div className='container gallery-content'>
            
            {
                !ready ? (
                    <div className="row justify-content-center" style={{ marginBottom: `250px`, marginTop:`10%` }} >
                        <div className="col-12">
                            <h6 className="text-center" ><CircularProgress color="secondary" /></h6>
                         </div>
                    </div>)
                    :
                    model === null ? (
                        <div className="row justify-content-center" style={{ marginBottom: `250px`, marginTop: `10%` }} >
                        <div className="col-12">
                                <h6 className="text-center" >Quelque chose s'est mal passé.</h6>
                        </div>
                    </div>) :
                        <>
                            <div className='row justify-content-end'>
                                <div className='col-8 col-md-4 col-lg-3 col-xl-3'>
                                    <Button variant="contained" className='add-pics-btn' onClick={toggleAdd} startIcon={<MdCameraEnhance />} >Ajouter photo</Button>
                                </div>
                            </div>
                            {
                                model.currentPhotos.length > 0 ? (<><div className='row gallery-grid'>
                                    {model.currentPhotos.map((img, i) => (<PhotoCard key={i}  img={img} />))}
                                </div>
                                    <div className='row gallery-grid-pagination'>
                                        <div className='col-12  col-md-8 col-lg-6 col-xl-6' >
                                            <Pagination count={pages} shape="rounded" page={currentPage} onChange={changePage} />
                                        </div>
                                    </div></>) : (
                                        <div className="row justify-content-center" style={{ marginBottom: `250px`, marginTop: `10%` }} >
                                            <div className="col-12">
                                                <h6 className="text-center" >Votre album est vide.</h6>
                                            </div>
                                        </div>)
                            }
                        </>
            }
            <Modal isOpen={modalAdd} fade={false} toggle={toggleAdd} style={{ width:`350px` }}>
                <ModalBody>
                    <Container>
                        <div className='row justify-content-center modal-add'>
                            <div className='col-12' >
                                <input
                                    accept="*/image"
                                    className="input-upload"
                                    id="button-add-img"
                                    multiple
                                    type="file"
                                    onChange={(e) => {
                                        setAddPhotoModel({ ...addPhotoModel, ['photo']: e.target.files[0] });
                                        var imgUrl = URL.createObjectURL(e.target.files[0]);
                                        setImg(imgUrl);
                                    }}
                                />
                            </div>
                          
                            <div className='col-12'>
                                <h6 className='text-center'>
                                    <div className='preview-album-photo' style={{ backgroundImage: `url(${img})` }}>
                                        <h6 className='text-center'>
                                                <IconButton style={{ marginTop: `25%` }} onClick={() => { document.getElementById("button-add-img").click(); }}>
                                                    <FiCamera style={{ fontSize: `22px` }} />
                                                </IconButton>
                                        </h6>
                                    </div>
                                </h6>
                            </div>
                            <div className='col-12'>
                                <TextField className='standard-input' label="Titre de la photo" variant="outlined"
                                    value={addPhotoModel.title}
                                    onChange={(e) => {
                                        setAddPhotoModel({ ...addPhotoModel, ['title']: e.target.value });

                                    }}
                                />
                            </div>
                            <div className='col-12'>
                                <br />
                                <br />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={addPhotoModel.hasPrice}
                                            onChange={(e) => {
                                                setAddPhotoModel({ ...addPhotoModel, ['hasPrice']: !addPhotoModel.hasPrice });
                                            }}
                                            color="primary"
                                        />
                                    }
                                    label="Est-ce un produit ou service ?"
                                />
                            </div>
                            {
                                !addPhotoModel.hasPrice ? null : <div className='col-12'>
                                    <TextField className='standard-input-price' placeholder="2500FCFA" label="Prix en FCFA" variant="outlined"
                                        value={addPhotoModel.price}
                                        onChange={(e) => {
                                            setAddPhotoModel({ ...addPhotoModel, ['price']: e.target.value });

                                        }}
                                    />
                                </div>
                            }
                            <div className='col-12'>
                                <Button variant="contained" className='account-btn' onClick={() => { sendNewData();  }}  ><span>Ajouter</span></Button>
                            </div>
                        </div>
                    </Container>
        </ModalBody>
            </Modal>
            <Modal isOpen={modalEdit} toggle={toggleEdit} style={{ width: `350px` }} >
                <ModalBody>
                    <Container>
                        <div className='row justify-content-center modal-add'>
                            <div className='col-12'>
                                <h6 className='text-center'>
                                    <div className='preview-album-photo' style={{ backgroundImage: `url('${editPhotoModel.photoUrl}')` }}>
                                    </div>
                                </h6>
                            </div>
                            <div className='col-12'>
                                <TextField className='standard-input' label="Titre de la photo" variant="outlined"
                                    value={editPhotoModel.title}
                                    onChange={(e) => {
                                        setEditPhotoModel({ ...editPhotoModel, ['title']: e.target.value });

                                    }}
                                />
                            </div>
                            <div className='col-12'>
                                <br />
                                <br />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={editPhotoModel.hasPrice}
                                            onChange={(e) => {
                                                setEditPhotoModel({ ...editPhotoModel, ['hasPrice']: !editPhotoModel.hasPrice });
                                            }}
                                            color="primary"
                                        />
                                    }
                                    label="Est-ce un produit ou service ?"
                                />
                            </div>
                            {
                                !editPhotoModel.hasPrice ? null : <div className='col-12'>
                                    <TextField className='standard-input-price' placeholder="2500FCFA" label="Prix en FCFA" variant="outlined"
                                        value={editPhotoModel.price}
                                        onChange={(e) => {
                                            setEditPhotoModel({ ...editPhotoModel, ['price']: e.target.value });

                                        }}
                                    />
                                </div>
                            }
                            <div className='col-6'>
                                <br />
                                <br />
                                <Button variant="contained" className='btn-delete' onClick={() => { deleteData(editPhotoModel.photoId); }}  ><span>Supprimer</span></Button>
                            </div>
                            <div className='col-6'>
                                <br />
                                <br />
                                <Button variant="contained" className='btn-delete' color="primary" onClick={() => { sendEditData(); }}  ><span>Sauvegarder</span></Button>
                            </div>
                        </div>
                    </Container>
                    </ModalBody>
            </Modal>
        </div>);
}

