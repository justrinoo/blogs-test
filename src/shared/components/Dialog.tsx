'use client';

import { Modal } from 'antd';

export default function Dialog({
  title,
  open,
  setOpen,
  children,
}: {
  title: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title={title}
        open={open}
        okText=''
        onCancel={handleCancel}
        // cancelText=''
        closeIcon={false}
        // closable={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        {children}
      </Modal>
    </>
  );
}
