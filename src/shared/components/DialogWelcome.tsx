import React, { useEffect, useState } from 'react';
import Dialog from './Dialog';
import { Button } from 'antd';
import axios from 'axios';
import { useNotification } from '@/shared/hooks/useNotification';

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export default function DialogWelcome({ open, setOpen }: Props) {
  const { openNotificationWithIcon } = useNotification();
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      const savedToken = localStorage.getItem('bearerToken');
      if (!savedToken) return;

      setLoading(true);
      setError(null);

      try {
        await axios.get('https://gorest.co.in/public/v2/posts', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        setToken(savedToken);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Token is invalid.');
      } finally {
        setLoading(false);
      }
    };

    if (open) validateToken();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      openNotificationWithIcon('error', {
        message: 'Error',
        description: 'Bearer Token is required!',
      });

      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.get(
        `https://gorest.co.in/public/v2/posts?access-token=${token}`
      );
      localStorage.setItem('bearerToken', token);
      openNotificationWithIcon('success', {
        message: 'Success',
        description: 'Token validated and saved!',
      });

      setOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Token validation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog title='Welcome!' open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit} className='space-y-3'>
        <input
          type='text'
          placeholder='Name'
          className='w-full outline-none p-1.5 rounded-md border border-[#8294C4]'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type='text'
          placeholder='Bearer Token'
          className={`w-full outline-none p-1.5 rounded-md border ${
            error ? 'border-red-500' : 'border-[#8294C4]'
          }`}
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <Button
          htmlType='submit'
          className='w-full p-3 bg-[#8294C4] text-white hover:bg-[#6473b3]'
          disabled={loading}
        >
          {loading ? 'Validating...' : 'Submit'}
        </Button>
      </form>
    </Dialog>
  );
}
