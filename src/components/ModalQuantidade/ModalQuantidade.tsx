import React, { useState } from "react";
import styles from "./ModalQuantidade.module.scss";

interface ModalQuantidadeProps {
  onClose: () => void;
  onConfirm: (quantidade: number, observacao: string) => void;
  qtdeMaxima: number;
  quantidadeFixa?: number;
  titulo?: string;
  modo?: "parcial" | "reconferencia";
}

const ModalQuantidade: React.FC<ModalQuantidadeProps> = ({ onClose, onConfirm, qtdeMaxima, quantidadeFixa, titulo, modo }) => {
  const [quantidade, setQuantidade] = useState(quantidadeFixa ?? 0);
  const [observacao, setObservacao] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const validarEConfirmar = () => {

    if(modo == 'parcial'){
    if (quantidade <= 0) {
      setErro("A quantidade deve ser maior que zero.");
      return;
    }
  
    if (quantidade >= qtdeMaxima) {
      if(quantidade == qtdeMaxima){
        setErro(`Você não pode liberar a quantidade correta pela liberação parcial.`);
        return;
      }
      setErro(`Quantidade excede o máximo permitido de ${qtdeMaxima-1}.`);
      return;
    }
  }
   
  if(modo == 'reconferencia'){
    if (!observacao.trim()) {
      setErro("A observação é obrigatória.");
      return;
    }
  }
    
   
   //Comentado para caso solicitem a observação ser obrigatória
    // if (!observacao.trim()) {
    //   setErro("A observação é obrigatória.");
    //   return;
    // }
  
    setErro("");
    setIsLoading(true); 
    onConfirm(quantidade, observacao);
  
  };  


  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
            <p>Processando...</p>
          </div>
        ) : (
          <>
            <h2 className={styles.hdois}>{titulo || ""}</h2>

            <label 
              style={modo === "reconferencia" ? { visibility: "hidden", height: 0, margin: 0, padding: 0 } : {}}
            >
              Digite a quantidade (máximo {qtdeMaxima-1}):
            </label>
            <input 
              type="number" 
              value={quantidade} 
              onChange={(e) => setQuantidade(Number(e.target.value))} 
              max={qtdeMaxima} 
              disabled={quantidadeFixa !== undefined}
              readOnly={quantidadeFixa !== undefined}
              style={modo === "reconferencia" ? { visibility: "hidden", height: 0, margin: 0, padding: 0 } : {}}
            />
  
            <label>Observação:</label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Insira a justificativa"
              rows={3}
            />
  
            {erro && <p className={styles.erro}>{erro}</p>}
  
            <div className={styles.actions}>
              <button onClick={validarEConfirmar}>Confirmar</button>
              <button onClick={onClose}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
  
};

export default ModalQuantidade;
