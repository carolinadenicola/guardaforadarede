import React, { useState } from "react";
import styles from "./ModalReserva.module.scss";

interface ModalReservaProps {
  onClose: () => void;
  onConfirm: (localizacao: string, quantidade: number) => void;
  locaisExistentes: { local: string; quantidade: number }[]; // Lista de locais e suas quantidades
  qtdeRestante: number;
  codigoItem: string;
}

const ModalReserva: React.FC<ModalReservaProps> = ({
  onClose,
  onConfirm,
  locaisExistentes,
  qtdeRestante,
  codigoItem,
}) => {
  const [localSelecionado, setLocalSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(qtdeRestante);

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h3>GUARDAR ITEM COMO RESERVA</h3>
        <p>Item: <strong>{codigoItem}</strong></p>

        {/* Exibe os locais onde o item já está armazenado */}
        <div className={styles.locaisContainer}>
          <h4 className={styles.hquatro}>Locais já cadastrados:</h4>
          {locaisExistentes.length > 0 ? (
            <ul>
              {locaisExistentes.map((loc, index) => (
                <li key={index}>
                  📍 <strong>{loc.local}</strong> - {loc.quantidade} unidades
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma reserva existente para este item.</p>
          )}
        </div>

        {/* Campo para inserir o novo local */}
        <div className={styles.inputContainer}>
          <label>Digite o novo local de armazenamento:</label>
          <input
            type="text"
            value={localSelecionado}
            onChange={(e) => setLocalSelecionado(e.target.value)}
            placeholder="Informe o local"
          />
        </div>

        {/* Campo de quantidade a ser armazenada no novo local */}
        <div className={styles.inputContainer}>
          <label>Quantidade a reservar (Máximo: {qtdeRestante}):</label>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => {
              const valor = Number(e.target.value);
              if (valor <= qtdeRestante && valor > 0) {
                setQuantidade(valor);
              }
            }}
            max={qtdeRestante}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelar} onClick={onClose}>Cancelar</button>
          <button
            className={styles.confirmar}
            onClick={() => onConfirm(localSelecionado, quantidade)}
            disabled={!localSelecionado || quantidade <= 0 || quantidade > qtdeRestante}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalReserva;
