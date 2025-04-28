import React, { useState } from "react";
import styles from './ModalEditar.module.scss';

interface ModalEditarProps {
  icon?: React.ReactNode;
  iconColor?: string;
  message: string;
  onClose: () => void; // Função chamada ao clicar em "Cancelar"
  onConfirm: (qtdeAtual: number) => void; // Função chamada ao clicar em "Ok"
  qtdeAtualInicial: number; // Valor inicial de qtdeAtual
}

const ModalEditar: React.FC<ModalEditarProps> = ({ 
  icon, 
  iconColor = "black", 
  message, 
  onClose, 
  onConfirm, 
  qtdeAtualInicial 
}) => {
  const [qtdeAtual, setQtdeAtual] = useState<number>(qtdeAtualInicial); // Estado local para qtdeAtual

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {icon && (
          <div className={styles.iconeTamanho}>
            {React.cloneElement(icon as React.ReactElement, { color: iconColor })}
          </div>
        )}
        <p style={{ whiteSpace: "pre-wrap" }}>{message}</p>
        <div className={styles.inputContainer}>
          <label htmlFor="qtdeAtual">Quantidade Total</label>
          <input
            id="qtdeAtual"
            type="number"
            value={qtdeAtual}
            onChange={(e) => setQtdeAtual(Number(e.target.value))}
          />
        </div>
        <div className={styles.actions}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={() => onConfirm(qtdeAtual)}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditar;
