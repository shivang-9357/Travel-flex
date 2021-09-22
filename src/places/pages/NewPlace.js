import React, {useContext} from "react"; 
import {useHistory} from 'react-router-dom';
import Input from "../../shared/components/FormElements/Input";
import {VALIDATOR_REQUIRE} from "../../shared/components/util/validators";
import { VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import {useForm} from "../../shared/hooks/form-hook";
import {useHttpClient} from '../../shared/hooks/http-hook';
import "./NewPlace.css";



const NewPlace = ()=> {
    const auth = useContext(AuthContext);
   const {isLoading, error, sendRequest, clearError} = useHttpClient();
   const [formState, inputHandler] = useForm({
       image:{
           value: null,
           isValid:false
       },
    title:{
       value: "",
       isValid: false
   },
   description:{
       value:"",
       isValid: false
   },
   address: {
       value: "",
       isValid: false
   }
}, false);

const history = useHistory();

    const placeSubmitHandler = async event => {
        event.preventDefault();
        try {
            var formData = new FormData();

            formData.append("title", formState.inputs.title.value);
            formData.append("description", formState.inputs.description.value);
            formData.append("address", formState.inputs.address.value);
            formData.append("image", formState.inputs.image.value);

            await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places','POST', formData, {
                Authorization: "Bearer " + auth.token
            });
            history.push('/');
        } catch (error) {}
    };


    return (<React.Fragment >
        <ErrorModal error={error} onClear={clearError}/>
        {isLoading && <LoadingSpinner asOverlay/>}
        <form className="place-form" onSubmit={placeSubmitHandler}>
            <ImageUpload id="image" center onInput={inputHandler} errorText="Please select an image."/>
            <Input
             id="title"
             element="input" 
             type="text" 
             label="Title" 
             validators={[VALIDATOR_REQUIRE()]} 
             errorText="Please enter a valid text"
             onInput={inputHandler}/>
             <Input
             id="description"
             element="textarea" 
             label="Description" 
             validators={[VALIDATOR_MINLENGTH(5)]} 
             errorText="Please enter a valid decription(min 5 char)"
             onInput={inputHandler}/>
             <Input
             id="address"
             element="input" 
             label="Address" 
             validators={[VALIDATOR_REQUIRE()]} 
             errorText="Please enter a valid decription(min 5 char)"
             onInput={inputHandler}/>
             <Button type="submit" disabled = {!formState.isValid}>Add Place</Button>
        </form>
        </React.Fragment>
        
    )
}

export default NewPlace;