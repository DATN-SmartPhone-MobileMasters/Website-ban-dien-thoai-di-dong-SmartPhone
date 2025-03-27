// src/components/PermissionCheck.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getUserById } from './api';

const PermissionCheck = ({ requiredPermission = 1, redirectPath }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const userData = localStorage.getItem("userData");
        if (!userData) {
          navigate('/admin/login');
          return;
        }

        const user = JSON.parse(userData);
        const response = await getUserById(user.id);
        const userDetails = response.data;
        
        if (userDetails.MaQuyen > requiredPermission) {
          confirmAlert({
            title: 'Lỗi truy cập',
            message: 'Chỉ có admin mới có quyền truy cập chức năng này',
            buttons: [
              {
                label: 'Quay về',
                onClick: () => navigate(redirectPath || '/admin/dashboard')
              }
            ]
          });
        }
      } catch (error) {
        console.error("Error checking permission:", error);
        navigate('/admin/login');
      }
    };

    checkPermission();
  }, [navigate, requiredPermission, redirectPath]);

  return null;
};

export default PermissionCheck;