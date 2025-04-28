import React, { useState } from "react";
import styles from "./ModalQuantidade.module.scss";

interface ModalQuantidadeProps {
  onClose: () => void;
  onConfirm: (quantidade: number, observacao: string) => void;
  qtdeMaxima: number;
  quantidadeFixa?: number;
}

const ModalQuantidade: React.FC<ModalQuantidadeProps> = ({ onClose, onConfirm, qtdeMaxima, quantidadeFixa }) => {
  const [quantidade, setQuantidade] = useState(quantidadeFixa ?? 0);
  const [observacao, setObservacao] = useState("");

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h3>Quantidade a Transferir</h3>

        {/* Campo de Quantidade */}
        <label>Digite a quantidade (máximo {qtdeMaxima}):</label>
        <input 
          type="number" 
          value={quantidade} 
          onChange={(e) => setQuantidade(Number(e.target.value))} 
          max={qtdeMaxima} 
          disabled={quantidadeFixa !== undefined}
          readOnly={quantidadeFixa !== undefined}
        />

        {/* Campo de Observação */}
        <label>Observação (opcional):</label>
        <textarea
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Digite uma justificativa (se necessário)"
          rows={3}
        />

        <div className={styles.actions}>
          <button 
            onClick={() => 
              quantidade > 0 && quantidade <= qtdeMaxima ? onConfirm(quantidade, observacao) : null
            }
          >
            Confirmar
          </button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalQuantidade;
