import { useAuth } from './AuthContext'



const useHandleLogout = () =>{
  const {logout}  = useAuth();
  const handleSignout = () =>{
    logout();
  }
  return handleSignout;
}


export default useHandleLogout
