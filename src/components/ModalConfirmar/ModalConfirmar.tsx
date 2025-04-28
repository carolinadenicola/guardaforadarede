import React, { useState } from "react";
import styles from './ModalConfirmar.module.scss';

interface ModalConfirmarProps {
  icon?: React.ReactNode;
  iconColor?: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalConfirmar: React.FC<ModalConfirmarProps> = ({ icon, iconColor = "black", message, onClose, onConfirm }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {icon && (
          <div className={styles.iconeTamanho}>
            {React.cloneElement(icon as React.ReactElement, { color: iconColor })}
          </div>
        )}
        <p style={{ whiteSpace: "pre-wrap" }}>{message}</p>
        <div className={styles.actions}>
          <button onClick={onConfirm}>SIM</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmar;
