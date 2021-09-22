import React, {useState, useContext} from "react";

import {useForm} from "../../shared/hooks/form-hook";
import {useHttpClient} from '../../shared/hooks/http-hook';
import Input from "../../shared/components/FormElements/Input";
import {VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload"
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { Link} from "react-router-dom";
import {AuthContext} from "../../shared/context/auth-context";


import "./Authenticate.css";

const Authenticate =() => {

    const auth = useContext(AuthContext);

    const [isReg, setIsReg] = useState(true);

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        email:{
            value:"",
            isValid:false
        },
        password:{
            value:"",
            isValid:false
        }
    },false);

    const regStateHandler=()=>{
        if (!isReg) {
            setFormData(
                {
                    ...formState.inputs,
                    name:undefined,
                    image:undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        }else{
            setFormData(
                {
                   ...formState.inputs,
                   name:{
                       value:"",
                       isValid:false
                   },
                   image:{
                       value: null,
                       isValid: false
                   } 
                },false
            );
        }
           setIsReg(prevMode => !prevMode);
           
        };

    const authSubmitHandler = async (event)=>{

        event.preventDefault();
        if(isReg){
            try {
                
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/login`,'POST',
                JSON.stringify({
                    email:formState.inputs.email.value,
                    password:formState.inputs.password.value
                }),
                {
                    'Content-Type': 'application/json',
                }
              );
              auth.login(responseData.userId, responseData.token);
            }
               catch (error) {console.log(error);}
         }
        else{
            try {
                const formData = new FormData();
                
                formData.append('email', formState.inputs.email.value);
                formData.append('image', formState.inputs.image.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                
            
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
                    'POST',
                    formData
              );
              
                    auth.login(responseData.userId, responseData.token);
            }
               catch (error) {}   
    }
}





    return<React.Fragment> 
        <ErrorModal error={error} onClear={clearError}/>
    <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay/>}
        <form className="place-form" onSubmit={authSubmitHandler}>
            <h2>{isReg?"Login Required!":"Sign up Required!"}</h2>
            <hr />
        
        {!isReg &&
        <Input
        id="name"
        element="input"
        type="text"
        label="Full Name"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="This field is required."
        onInput={inputHandler}
        ></Input> 
        } 
        {!isReg && <ImageUpload id="image" center onInput={inputHandler} errorText="Please select an image."/>}

        <Input
        id="email"
        element="input"
        type="email"
        label="Email"
        validators={[VALIDATOR_EMAIL()]}
        errorText="Please enter a valid email."
        onInput={inputHandler}
        ></Input>

        <Input
        id="password"
        element="input"
        type="password"
        label="Password"
        validators={[VALIDATOR_MINLENGTH(8)]}
        errorText="Please enter a valid password(min. 8 characters)."
        onInput={inputHandler}
        ></Input>
        <Button type="submit" disabled={!formState.isValid} >{isReg?"LOGIN":"SIGN UP"}</Button>
    </form>
    <p> <Link onClick={regStateHandler}>{isReg?"New User? ": "Already a user? "}</Link></p>
    </Card>
    </React.Fragment>
}
export default Authenticate;