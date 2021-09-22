import React, {Suspense} from 'react';
import {BrowserRouter as Router,Route,Redirect,Switch} from "react-router-dom";

import Users from "./user/pages/Users";
import MainNavigation from './shared/components/Navigation/MainNavigation';
import {useAuth} from "./shared/hooks/auth-hook";
import {AuthContext} from "./shared/context/auth-context"
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';


const NewPlace = React.lazy(()=> import("./places/pages/NewPlace"));
const UpdatePlace = React.lazy(()=> import("./places/pages/UpdatePlace"));
const UserPlaces = React.lazy(()=> import("./places/pages/UserPlaces"));
const Authenticate = React.lazy(()=> import("./user/pages/Authenticate"));


const App = () => {
 
  const {token, login, logout, currentLoggedInId} = useAuth();

  var routes;
  if (!token) {
    routes=(
      <Switch>
        <Route path="/" exact>
         <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth" exact>
          <Authenticate />
        </Route>
        <Redirect to="/auth" />        
      </Switch>
    );
  }else{
    routes=(
      <Switch>
        <Route path="/" exact>
         <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new">
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
  <AuthContext.Provider 
  value={{ isLoggedIn: !!token, 
          token: token, 
          userId:currentLoggedInId, 
          login:login, 
          logout: logout
        }}>
    <Router>
    <MainNavigation />
    <main>
    <Suspense fallback={<div className="center">
      <LoadingSpinner />
    </div>}>
    {routes}
    </Suspense>
    </main>
  </Router>
  </AuthContext.Provider>
  );
}

export default App;
