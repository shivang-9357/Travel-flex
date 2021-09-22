import React, { useState,useContext } from 'react';
import { useHistory } from "react-router-dom";

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map'
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {AuthContext} from "../../shared/context/auth-context";
import {useHttpClient} from '../../shared/hooks/http-hook';

import './PlaceItem.css';

const PlaceItem = props => {
  const placeId = props.id;
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);

  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const history = useHistory();

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);
  const cancelDeleteWarningHandler = () => setShowConfirmModal(false);
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,'DELETE',null,
      {
        Authorization: 'Bearer ' + auth.token
      }
      );
      
      history.push(`/api/places/${placeId}`);
      props.onDelete(placeId);
    } catch (error) {}
  }


  return (
    <React.Fragment>
      
      <ErrorModal error= {error} onClear={clearError}/>
      
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">


           <Map center={props.coordinates} zoom={15}/>
        
        
        </div>
      </Modal>

      <Modal onCancel={cancelDeleteWarningHandler} show={showConfirmModal} header="Are you sure?" footerClass="place-item___modal-actions" footer={
        <React.Fragment>
          <Button inverse onClick={cancelDeleteWarningHandler}>Cancel</Button>
          <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
        </React.Fragment>
      }>
        <p>Note that if you choose "DELETE" your post will be permanently deleted !</p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
        {isLoading && <div className = "center"> <LoadingSpinner asOverlay/></div>}
          <div className="place-item__image">
            <img className="" src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} /> 
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
           {auth.userId === props.creatorId && <React.Fragment><Button to={`/places/${props.id}`}>EDIT</Button>
            <Button danger onClick={showDeleteWarningHandler}>DELETE</Button></React.Fragment>}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );

    }
export default PlaceItem;
