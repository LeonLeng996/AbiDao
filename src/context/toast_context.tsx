import React, { createContext, useContext, useState } from "react";
import { ToastContainer } from 'react-bootstrap';
import { Toast } from '../components';

interface toastType {
  title: string;
  text: string;
  type: 'success' | 'info' | 'warning' | 'danger' | '';
  autohide?: boolean;
  delay?: number; // duration in ms to hide the toast, autohide needs to be true
}

export const ToastContext = createContext({
  showToast: ( toastValue: toastType ) => {},
});

export const useToast = () => {
  return useContext(ToastContext);
}

export const ToastProvider = ({ children }) => {

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [type, setType] = useState('success');
  const [autohide, setAutohide] = useState(false);
  const [delay, setDelay] = useState(5000);

  const showToast = ( toastValue: toastType ) => {
    const { title, text, type, autohide, delay } = toastValue;
    setShow(true);
    setTitle(title)
    setText(text)
    setType(type)
    autohide && setAutohide(autohide);
    delay && setDelay(delay);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastContainer position='start-center'>
        <Toast 
          show={show} 
          title={title} 
          text={text} 
          type={type} 
          autohide={autohide} 
          delay={delay} 
          handleClose={()=>{setShow(false)}}
        />
      </ToastContainer>
      {children}
    </ToastContext.Provider>
  )
}