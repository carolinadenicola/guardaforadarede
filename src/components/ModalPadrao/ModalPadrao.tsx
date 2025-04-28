import React from "react";
import styles from './ModalPadrao.module.scss';

interface ModalProps {
  icon?: React.ReactNode;
  iconColor?: string;
  message: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const ModalPadrao: React.FC<ModalProps> = ({ icon, message, iconColor="black", onClose, children }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {icon && 
        <div className={styles.iconeTamanho}>
          {React.cloneElement(icon as React.ReactElement, { color: iconColor })}
        </div>}
        <p style={{ whiteSpace: "pre-wrap" }}>{message}</p>
        {children && <div className={styles.extraContent}>{children}</div>}
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default ModalPadrao;
