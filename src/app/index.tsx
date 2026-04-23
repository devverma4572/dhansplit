import React from 'react'
import { Redirect } from 'expo-router';
import useAuth from '../../hooks/useAuth';

function index() {
    const { user, loading } = useAuth();

    if(loading){
      return null;
    }

    if(user){
      return <Redirect href="/tabs/HomeScreen"/>
    }
    else{
      return <Redirect href="/WelcomeScreen"/>
    }
}

export default index