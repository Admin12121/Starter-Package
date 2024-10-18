import { useDispatch } from "react-redux";
import { toast } from 'sonner';
import { unSetUserToken } from '@/api/feature/authSlice';
import { removeToken } from '@/api/service/localStorageServices';
import { useNavigate } from "react-router-dom";

// Custom hook to handle logout
export const useHandleLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(unSetUserToken({ access_token: null }));
    removeToken();
    toast.success("Logged out", {
        action: {
            label: 'X',
            onClick: () => toast.dismiss(),
        },
    });
    navigate('/');
  };

  return handleLogout;
};