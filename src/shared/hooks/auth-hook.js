import {useState, useCallback, useEffect} from 'react';

let logoutTimer;

export const useAuth = ()=>{
    const [currentLoggedInId, setCurrentLoggedInId] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [token, setToken] = useState(null);
  
  
  
    const login = useCallback((uid, token, expirationDate)=>{
      setCurrentLoggedInId(uid);
      setToken(token);
      const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000*60*60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem('userData', JSON.stringify({userId: uid, token: token, expiration: tokenExpirationDate.toISOString()}));
    },[]);
    const logout = useCallback(()=>{
      setToken(null);
      setTokenExpirationDate(null);
      setCurrentLoggedInId(null);
      localStorage.removeItem('userData');
    },[]);
  
    useEffect(()=>{
      if (token && tokenExpirationDate) {
       const remainingTime = tokenExpirationDate.getTime() - new Date();
       logoutTimer =  setTimeout(logout, remainingTime);
      }else{
        clearTimeout(logoutTimer);
      }
    },[token, logout, tokenExpirationDate])
  
    useEffect(()=>{
      const storedData = JSON.parse(localStorage.getItem('userData'));
      console.log(storedData);
      if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
        login(storedData.userId, storedData.token);
      }
    }, [login]);

    return {token, login, logout, currentLoggedInId};
}