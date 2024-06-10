import { useLocation } from 'react-router-dom';
import AdminHeaderComponent from '../components/Admin/AdminHeader/AdminHeaderComponent';

function HeaderWrapper() {
    const location = useLocation();
    const publicRoutes = ['/admin'];

    if (publicRoutes.includes(location.pathname)) {
        return <AdminHeaderComponent />;
    } else {
        return <AdminHeaderComponent />; 
    }
}

export default HeaderWrapper;
