import { toast } from 'react-hot-toast';

export const globalAsyncHandler = async (asyncFn, options = {}) => {
  const { 
    setLoading, 
    onSuccess, 
    onError, 
    successMessage,
    returnFullResponse = false 
  } = options;

  try {
    if (setLoading) setLoading(true);
    
    const response = await asyncFn();
    
    if (successMessage) {
      toast.success(successMessage);
    }

    if (onSuccess) onSuccess(response?.data);
    
    return returnFullResponse ? response : response?.data;

  } catch (error) {
    console.error("API Error:", error);
    
    const message = 
      error?.response?.data?.message || 
      error?.message || 
      "Something went wrong";
      
    toast.error(message);
    
    if (onError) onError(error);
    return null;

  } finally {
    if (setLoading) setLoading(false);
  }
};