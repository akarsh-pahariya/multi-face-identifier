import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsLoadingToFalse,
  setIsLoadingToTrue,
} from '../store/slices/loadingSlice';
import { fetchGroupsList } from '../services/groupService';
import { addGroupList } from '../store/slices/groupSlice';
import { showErrorToast } from '../components/ui/Toast';

const useGroups = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((store) => store.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      const getGroupsList = async () => {
        dispatch(setIsLoadingToTrue());

        try {
          const response = await fetchGroupsList();
          dispatch(addGroupList(response.data.groups));
        } catch (error) {
          console.log('Unable to fetch the groups user has joined ', error);
          showErrorToast(
            'Unexpected error occured, cannot fetch the groups user has joined, try reloading the page'
          );
        }
        dispatch(setIsLoadingToFalse());
      };

      getGroupsList();
    }
  }, [dispatch, isLoggedIn]);
};

export default useGroups;
