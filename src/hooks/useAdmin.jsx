import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
 
const useAdmin = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
 
  const { data: isAdmin = false, isLoading } = useQuery({
    queryKey:  ['isAdmin', user?.email],
    enabled:   !!user?.email && !loading,
    queryFn:   async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data?.role === 'admin';
    },
  });
 
  return { isAdmin, isLoading };
};
 
export default useAdmin;
 