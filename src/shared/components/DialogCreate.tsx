import React, { useState } from 'react';
import axios from 'axios';
import Dialog from './Dialog';
import { useFetch } from '../hooks/useFetch';
import { useNotification } from '../hooks/useNotification';

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  refetch: () => void;
  token: string;
};

const initialFormData = { user_id: '', title: '', body: '' };
const validationRules = [
  { field: 'user_id', message: 'User ID must be a number' },
  { field: 'title', message: 'Title is required' },
  { field: 'body', message: 'Body is required' },
];

export default function DialogCreate({ open, setOpen, refetch, token }: Props) {
  const { openNotificationWithIcon } = useNotification();
  const { data: users, isLoading } = useFetch<any>(
    ['users'],
    `/users?access-token=${token}`
  );

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    validationRules.forEach(({ field, message }) => {
      if (!formData[field]) newErrors[field] = message;
      if (field === 'user_id' && isNaN(Number(formData[field])))
        newErrors[field] = message;
    });
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post('https://gorest.co.in/public/v2/posts', formData, {
        headers: {
          Authorization: `Bearer a2b144882905a283f6515572b5c9cc2509f519ec6f9c32970c0ee1b85f45d9c1`,
        },
      });
      openNotificationWithIcon('success', {
        message: 'Success',
        description: 'Post created successfully!',
      });
      setOpen(false);
      setFormData(initialFormData);
      refetch();
    } catch (error: any) {
      openNotificationWithIcon('error', {
        message: 'Failed',
        description: `Failed to create post: ${
          error.response?.data?.message || error.message
        }`,
      });
    }
  };

  const renderInput = (name: string, type: string, placeholder: string) => (
    <div>
      {type === 'textarea' ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full p-1.5 rounded-md border ${
            errors[name] ? 'border-red-500' : 'border-[#8294C4]'
          }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full p-1.5 rounded-md border ${
            errors[name] ? 'border-red-500' : 'border-[#8294C4]'
          }`}
        />
      )}
      {errors[name] && <p className='text-red-500 text-sm'>{errors[name]}</p>}
    </div>
  );

  return (
    <Dialog title='Create Blog Post' open={open} setOpen={setOpen}>
      <form className='space-y-3' onSubmit={handleSubmit}>
        <div>
          <select
            name='user_id'
            value={formData.user_id}
            onChange={handleChange}
            className={`w-full p-1.5 rounded-md border ${
              errors.user_id ? 'border-red-500' : 'border-[#8294C4]'
            }`}
          >
            <option value=''>Select User</option>
            {isLoading ? (
              <option>Loading...</option>
            ) : (
              users?.data?.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))
            )}
          </select>
          {errors.user_id && (
            <p className='text-red-500 text-sm'>{errors.user_id}</p>
          )}
        </div>
        {renderInput('title', 'text', 'Title')}
        {renderInput('body', 'textarea', 'Body')}
        <button
          type='submit'
          className='w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition'
        >
          Submit
        </button>
      </form>
    </Dialog>
  );
}
