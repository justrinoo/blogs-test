import React from 'react';
import Dialog from './Dialog';

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  dataDetail: {
    title: string;
    body: string;
    user_id: string;
  };
};

export default function DialogDetail({ open, setOpen, dataDetail }: Props) {
  return (
    <Dialog title='Detail Blog Post' open={open} setOpen={setOpen}>
      <div className='space-y-4'>
        {' '}
        <div>
          <h3 className='text-lg font-semibold'>Title:</h3>
          <p className='text-gray-800'>{dataDetail.title}</p>
        </div>
        <div>
          <h3 className='text-lg font-semibold'>Body:</h3>
          <p className='text-gray-800'>{dataDetail.body}</p>
        </div>
        <div>
          <h3 className='text-lg font-semibold'>User ID:</h3>
          <p className='text-gray-800'>{dataDetail.user_id}</p>
        </div>
      </div>
    </Dialog>
  );
}
