import {createContext, ReactNode, useContext, useState} from 'react'

type Toast = {
    id:string;
    message:string;
    type?:'success' | 'error';
}

type ToastContextType = {
    showToast : (message:string, type?: Toast['type'])=>void;
}

const ToastContext = createContext<ToastContextType>({showToast:()=>{}});

export const useToast = ()=>useContext(ToastContext);

export const ToastProvider = ({children}:{children:ReactNode})=>{
    const [toasts, setToasts] =  useState<Toast[]>([]);

    const showToast = (message:string, type:Toast['type'])=>{
        const id =  Date.now().toString();
        const newToast:Toast = {id:id, message:message, type:type};
        setToasts((prev)=>([...prev, newToast]));
        setTimeout(()=>{
            setToasts((prev)=>prev.filter((item:Toast)=>item.id !== id));
        },3000);
    }
      console.log('ToastProvider mounted');
    return (
        <ToastContext.Provider value={{showToast}}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                <div key={toast.id} className={`toast ${toast.type}-msg`}>
                    {toast.message}
                </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}