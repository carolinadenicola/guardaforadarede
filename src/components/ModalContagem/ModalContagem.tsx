import React, { useState, useEffect } from "react";
import styles from "./ModalContagem.module.scss";
import { FaClock } from "react-icons/fa";

interface ModalContagemProps {
  onClose: () => void;
  onConfirm: (quantidade: number) => void;
  onReservaRestante: (quantidade: number) => void; // Nova função
  qtdeFinal: number;
  codigoItem: string;
  primeiraQuantidade: number;
  onError: (mensagem: string) => void;
}

const ModalContagem: React.FC<ModalContagemProps> = ({ 
  onClose, 
  onConfirm, 
  onReservaRestante,
  qtdeFinal, 
  codigoItem, 
  primeiraQuantidade, 
  onError 
}) => {
  const [quantidadeAtual, setQuantidadeAtual] = useState(0);
  const [inputCodigo, setInputCodigo] = useState("");

  useEffect(() => {
    if (primeiraQuantidade > 0) {
      setQuantidadeAtual(primeiraQuantidade);
    }
  }, [primeiraQuantidade]);

  const adicionarQuantidade = () => {
    if (!inputCodigo.includes("|") || !inputCodigo.includes("/")) {
      onError("Formato inválido do código inserido!");
      return;
    }

    const [codigoBase, resto] = inputCodigo.split("|");
    const [quantidadeStr] = resto.split("/");
    const quantidade = parseInt(quantidadeStr, 10);

    if (codigoBase !== codigoItem) {
      onError(`Código incorreto! Esperado: ${codigoItem}, Inserido: ${codigoBase}`);
      return;
    }

    if (isNaN(quantidade) || quantidade <= 0) {
      onError("Quantidade inválida!");
      return;
    }

    const novoTotal = quantidadeAtual + quantidade;

    if (novoTotal > qtdeFinal) {
      onError(`A quantidade inserida (${novoTotal}) ultrapassa a quantidade final (${qtdeFinal}).`);
      return;
    }

    setQuantidadeAtual(novoTotal);
    setInputCodigo("");
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.iconeTamanho}>
          <FaClock color="#FFCC00" size={50} />
        </div>
        <h3>GUARDANDO ITEM</h3>
        <p>{codigoItem}</p>

        <div className={styles.contador}>
          <span>{quantidadeAtual}</span> / <span>{qtdeFinal}</span>
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="codigoItem">Digite ou bipar o código do item:</label>
          <input
            id="codigoItem"
            type="text"
            value={inputCodigo}
            onChange={(e) => setInputCodigo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionarQuantidade()}
            placeholder="Leia ou digite o código do item"
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelar} onClick={onClose}>Cancelar</button>
          <button
            className={quantidadeAtual === qtdeFinal ? styles.finalizar : styles.desativado}
            onClick={() => quantidadeAtual === qtdeFinal && onConfirm(quantidadeAtual)}
            disabled={quantidadeAtual !== qtdeFinal}
          >
            Finalizar
          </button>
        </div>

        <button className={styles.reserva} onClick={() => onReservaRestante(quantidadeAtual)}>
          Guardar restante em outro local
        </button>
      </div>
    </div>
  );
};

export default ModalContagem;
