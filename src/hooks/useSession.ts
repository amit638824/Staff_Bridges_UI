import { useSelector } from "react-redux"; 
export const useSession = () => {
  const { user, token } = useSelector((state: any) => state.user); 
  return {
    user,
    token,
    isLoggedIn: !!token,  
  };
};