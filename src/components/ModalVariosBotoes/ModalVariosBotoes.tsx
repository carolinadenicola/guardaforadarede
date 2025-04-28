import React from "react";
import styles from "./ModalVariosBotoes.module.scss";

interface ButtonOption {
  label: string;
  action: () => void;
  color?: string; // Define a cor do botão (opcional)
}

interface ModalVariosBotoesProps {
  icon?: React.ReactNode;
  iconColor?: string;
  message: string;
  onClose: () => void;
  buttons: ButtonOption[]; // Lista de botões dinâmicos
}

const ModalVariosBotoes: React.FC<ModalVariosBotoesProps> = ({ icon, iconColor = "black", message, onClose, buttons }) => {
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
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              style={{ backgroundColor: button.color || "#ccc" }} // Usa a cor definida ou cinza como padrão
            >
              {button.label}
            </button>
          ))}
          <button onClick={onClose} style={{ backgroundColor: "gray" }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalVariosBotoes;
