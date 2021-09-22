import React from "react";

import Card from "../../shared/components/UIElements/Card";
import "./UsersList.css";

import UserItem from "./UserItem.js";
const UserList = (props)=>{
    if(props.items.length === 0){
        return <div className="center">
            <Card>
            <h2>
                No Users Found !
            </h2>
            </Card>
        </div>
    }

    else{
        return <ul className="users-list">
            {props.items.map(user =>
                 <UserItem 
                 key={user.id} 
                 uid={user.id} 
                 image={user.image} 
                 name={user.name} 
                 placeCount={user.places.length} />)}
        </ul>
    }
}

export default UserList;