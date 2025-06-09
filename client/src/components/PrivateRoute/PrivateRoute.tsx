import { Navigate } from 'react-router-dom'

type PrivateRouteProps = {
    isAuthenticated: Boolean,
    children: JSX.Element,
    loading:Boolean,
}

const PrivateRoute = ({ isAuthenticated, loading, children }: { isAuthenticated: boolean; loading: boolean; children: JSX.Element }) => {
    if (loading) return <div>Loading...</div>;

    return isAuthenticated ? children : <Navigate to="/auth" />;
};


export default PrivateRoute