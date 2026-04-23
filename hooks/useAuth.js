import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth } from '../config/firebase';

function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, currentUser => {
            console.log('got user:', currentUser);
            setUser(currentUser);
            setLoading(false);
    });
  return unsub;
  
},[]);

return { user, loading };
}
export default useAuth;
