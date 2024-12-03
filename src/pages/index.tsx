'use client';

import * as React from 'react';
import { useFetch } from '@/shared/hooks/useFetch';
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import DialogWelcome from '@/shared/components/DialogWelcome';
import DialogCreate from '@/shared/components/DialogCreate';
import DialogEdit from '@/shared/components/DialogEdit';
import DialogDelete from '@/shared/components/DialogDelete';
import DialogDetail from '@/shared/components/DialogDetail';

export default function Home() {
  const [token, setToken] = React.useState<any>(null);
  const [detail, setDetail] = React.useState({
    id: '',
    title: '',
    body: '',
    user_id: '',
  });
  const [openWelcome, setOpenWelcome] = React.useState<boolean>(false);

  const [openDetail, setOpenDetail] = React.useState<boolean>(false);
  const [openCreate, setOpenCreate] = React.useState<boolean>(false);
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);
  const [openDelete, setOpenDelete] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const pageSize = 5;

  const { data, isLoading, error, refetch } = useFetch<any>(
    token ? ['posts', searchTerm, currentPage] : null,
    token
      ? `/posts?access-token=${token}&title=${searchTerm}&page=${currentPage}&per_page=${pageSize}`
      : null
  );

  const posts = data?.data || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination.pages || 1;

  React.useEffect(() => {
    const storedToken = localStorage.getItem('bearerToken');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setOpenWelcome(true);
    }
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error occurred</p>;

  return (
    <main>
      <div className='grid grid-cols-12'>
        <div className='col-span-3'>
          <div className='flex h-screen flex-col justify-between border-e bg-white'>
            <ul className='mt-6 space-y-1 px-2'>
              <li>
                <a
                  href='#'
                  className='block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700'
                >
                  Blog Post
                </a>
              </li>
            </ul>
            <div className='sticky inset-x-0 bottom-0 border-t border-gray-100'>
              <a
                href='#'
                className='flex items-center gap-2 bg-white p-4 hover:bg-gray-50'
              >
                <img
                  alt=''
                  src='https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                  className='size-10 rounded-full object-cover'
                />
                <div>
                  <p className='text-xs'>
                    <strong className='block font-medium'>
                      Eric Frusciante
                    </strong>
                    <span> eric@frusciante.com </span>
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className='col-span-9 p-12'>
          <div className='flex items-center gap-5 mb-5'>
            <h1 className='text-3xl font-semibold'>Blog Post</h1>
            <button
              onClick={() => setOpenCreate(true)}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              <PlusOutlined />
            </button>
          </div>
          <div className='mb-4'>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search by title'
              className='w-full px-4 py-2 border rounded-lg'
            />
          </div>
          <div className='rounded-lg border border-gray-200'>
            <div className='overflow-x-auto rounded-t-lg'>
              <table className='min-w-full divide-y-2 divide-gray-200 bg-white text-sm'>
                <thead>
                  <tr>
                    <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
                      Title
                    </th>
                    <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
                      Description
                    </th>
                    <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {posts.map((post: any) => (
                    <tr key={post.id}>
                      <td className='px-4 py-2 font-medium text-gray-900'>
                        {post.title}
                      </td>
                      <td className='px-4 py-2 text-gray-700'>{post.body}</td>
                      <td className='px-4 py-2 text-gray-700'>
                        <button
                          onClick={() => {
                            setOpenDetail(true);
                            setDetail(post);
                          }}
                          className='p-3 text-gray-600 rounded-tr-md rounded-tl-md bg-[#FFD09B]'
                        >
                          <EyeOutlined />
                        </button>
                        <button
                          onClick={() => {
                            setOpenEdit(true);
                            setDetail(post);
                          }}
                          className='p-3 text-gray-600 bg-[#C1CFA1]'
                        >
                          <EditOutlined />
                        </button>
                        <button
                          onClick={() => {
                            setOpenDelete(true);
                            setDetail(post);
                          }}
                          className='p-3 text-gray-600 rounded-br-md rounded-bl-md bg-[#FFB0B0]'
                        >
                          <DeleteOutlined />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='rounded-b-lg border-t border-gray-200 px-4 py-2'>
              <ol className='flex justify-end gap-1 text-xs font-medium'>
                {Array.from(
                  { length: Math.min(15, totalPages) },
                  (_, i) => i + 1
                )
                  .slice(
                    Math.max(0, currentPage - 6), // Menampilkan 5 sebelum halaman aktif
                    Math.min(totalPages, currentPage + 9) // dan 9 setelah halaman aktif
                  )
                  .map((page) => (
                    <li key={page}>
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`block size-8 rounded ${
                          currentPage === page
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-100 bg-white text-gray-900'
                        } text-center leading-8`}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      {openWelcome && (
        <DialogWelcome open={openWelcome} setOpen={setOpenWelcome} />
      )}
      {openCreate && (
        <DialogCreate
          token={token}
          refetch={refetch}
          open={openCreate}
          setOpen={setOpenCreate}
        />
      )}
      {openEdit && (
        <DialogEdit
          token={token}
          refetch={refetch}
          postId={`${detail.id}`}
          open={openEdit}
          setOpen={setOpenEdit}
        />
      )}
      {openDelete && (
        <DialogDelete
          token={token}
          onDeleteSuccess={() => setOpenDelete(false)}
          refetch={refetch}
          postId={`${detail.id}`}
          open={openDelete}
          setOpen={setOpenDelete}
        />
      )}
      {openDetail && (
        <DialogDetail
          dataDetail={detail}
          open={openDetail}
          setOpen={setOpenDetail}
        />
      )}
    </main>
  );
}
