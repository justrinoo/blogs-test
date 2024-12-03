import React, { useState } from 'react';
import axios from 'axios';
import Dialog from './Dialog';
import { useNotification } from '../hooks/useNotification';

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  postId: string;
  onDeleteSuccess: () => void;
  refetch: () => void;
  token: string;
};

export default function DialogDelete({
  open,
  setOpen,
  postId,
  onDeleteSuccess,
  refetch,
  token,
}: Props) {
  const { openNotificationWithIcon } = useNotification();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`https://gorest.co.in/public/v2/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      openNotificationWithIcon('success', {
        message: 'Success',
        description: 'Post deleted successfully!',
      });
      setOpen(false);
      onDeleteSuccess();
      refetch();
    } catch (error: any) {
      openNotificationWithIcon('error', {
        message: 'Failed',
        description: `Failed to delete post: ${
          error.response?.data?.message || error.message
        }`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog title='Delete Blog Post' open={open} setOpen={setOpen}>
      <div className='space-y-4'>
        <p>Are you sure you want to delete this post?</p>
        <div className='flex justify-end space-x-3'>
          <button
            onClick={() => setOpen(false)}
            className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition'
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition'
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
