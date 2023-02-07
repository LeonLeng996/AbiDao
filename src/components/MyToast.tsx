import React, { createContext, useState } from 'react';
import { Toast } from 'react-bootstrap'

interface toastProps {
  show: boolean;
  title: string;
  text: string;
  type: 'success' | 'info' | 'warning' | 'danger' ;
  autohide?: boolean;
  delay?: number;
  handleClose:() => void
}

export default function MyToast(props: toastProps) {
  const { show, title, text, type, autohide, delay, handleClose } = props;

  return (
    <Toast onClose={handleClose} show={show} autohide={autohide} delay={delay} bg={type} className=''>
      <Toast.Header>
        <strong className="me-auto">{title}</strong>
      </Toast.Header>
      <Toast.Body>{text}</Toast.Body>
    </Toast>
  )
}