import React, { useState, useEffect } from "react";
import styles from "./ModalReserva.module.scss";

interface ModalReservaProps {
  onClose: () => void;
  onConfirm: (locais: { local: string; quantidade: number }[]) => void;
  locaisExistentes: { local: string; quantidade: number }[];
  codigoItem: string;
  qtdeRestante: number;
  localOriginal?: string; 
}

const ModalReserva: React.FC<ModalReservaProps> = ({
  onClose,
  onConfirm,
  locaisExistentes,
  codigoItem,
  qtdeRestante,
  localOriginal,
}) => {
  const [locaisInternos, setLocaisInternos] = useState<{ local: string; quantidade: number }[]>([]);
  const [novoLocal, setNovoLocal] = useState("");
  const [novoCodigo, setNovoCodigo] = useState(""); // agora recebe o código completo
  const [erro, setErro] = useState("");
  const [indexParaRemover, setIndexParaRemover] = useState<number | null>(null);
  const [localParaRemover, setLocalParaRemover] = useState<string | null>(null);


  const removerLocal = (index: number) => {
    const novosLocais = [...locaisInternos];
    novosLocais.splice(index, 1);
    setLocaisInternos(novosLocais);
  };

  useEffect(() => {
    setLocaisInternos(locaisExistentes); // inicia com o que veio do Estoque
  }, [locaisExistentes]);

  const adicionarOuSomarLocal = () => {
    setErro(""); // reseta erro

    if (!novoLocal.trim() || !novoCodigo.trim()) {
      setErro("Preencha o local e o código corretamente.");
      return;
    }

    if (!novoCodigo.includes("|") || !novoCodigo.includes("/")) {
      setErro("Formato inválido! Use: código|quantidade/nota");
      return;
    }

    const [codigoBase, resto] = novoCodigo.split("|");
    const [quantidadeStr, nota] = resto.split("/");
    const quantidadeExtraida = parseInt(quantidadeStr, 10);

    
    const chaveDocumentoReconstruida = `${codigoBase}/${nota}`;

    console.log(codigoItem)

    if (chaveDocumentoReconstruida !== codigoItem) {
      setErro(`Código diferente do item esperado! Esperado: ${codigoItem}, Digitado: ${chaveDocumentoReconstruida}`);
      return;
    }

    if (isNaN(quantidadeExtraida) || quantidadeExtraida <= 0) {
      setErro("Quantidade inválida no código!");
      return;
    }

    const totalJaReservado = locaisInternos.reduce((soma, loc) => soma + loc.quantidade, 0);
    const totalDepois = totalJaReservado + quantidadeExtraida;

    if (totalDepois > qtdeRestante) {
      setErro(`A quantidade total (${totalDepois}) ultrapassa o máximo permitido (${qtdeRestante}).`);
      return;
    }

    const indiceExistente = locaisInternos.findIndex(
      (loc) => loc.local.toLowerCase() === novoLocal.trim().toLowerCase()
    );

    if (indiceExistente >= 0) {
      // Se já existe o local, soma a quantidade
      const novosLocais = [...locaisInternos];
      novosLocais[indiceExistente].quantidade += quantidadeExtraida;
      setLocaisInternos(novosLocais);
    } else {
      // Se não existe, adiciona novo
      setLocaisInternos((prev) => [...prev, { local: novoLocal.trim(), quantidade: quantidadeExtraida }]);
    }

    // Limpa os campos depois de adicionar
    setNovoLocal("");
    setNovoCodigo("");
  };

  const somaQuantidades = locaisInternos.reduce((total, loc) => total + loc.quantidade, 0);


  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h3>GUARDAR COMO RESERVA</h3>
        <p>Item: <strong>{codigoItem}</strong></p>
        <p>Quantidade disponível para guarda: <strong>{qtdeRestante}</strong></p>

        {/* Lista de locais preenchidos */}
        <div className={styles.locaisContainer}>
          {locaisInternos.length > 0 ? (
            <ul>
              {locaisInternos.map((loc, index) => (
                <li key={index} className={styles.localItem}>
                  <div>
                    📍 <strong>{loc.local}</strong> - QTD: {loc.quantidade}
                    {localOriginal && loc.local.toLowerCase() === localOriginal.toLowerCase() && (
                      <span className={styles.destaqueOriginal}> ⭐</span>
                    )}
                  </div>
                  <button className={styles.removerBtn} 
                      onClick={() => {
                        setIndexParaRemover(index);
                        setLocalParaRemover(loc.local);
                      }}>
                        ❌
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum local adicionado.</p>
          )}
        </div>

        {/* Inputs */}
        <div className={styles.inputContainer}>
          <label>LOCAL:</label>
          <input
            type="text"
            value={novoLocal}
            onChange={(e) => setNovoLocal(e.target.value)}
            placeholder="Informe o local"
          />
        </div>

        <div className={styles.inputContainer}>
          <label>ITEM:</label>
          <input
            type="text"
            value={novoCodigo}
            onChange={(e) => setNovoCodigo(e.target.value)}
            placeholder="Informe o item"
            onKeyDown={(e) => e.key === "Enter" && adicionarOuSomarLocal()}
          />
        </div>

        {/* Mensagem de erro */}
        {erro && <p style={{ color: "#E46962", fontWeight: "bold" }}>{erro}</p>}

        {/* Botões */}
        <div className={styles.actions}>
          <button className={styles.cancelar} onClick={onClose}>Cancelar</button>
          <button
            className={styles.adicionar}
            onClick={adicionarOuSomarLocal}
            disabled={!novoLocal || !novoCodigo}
          >
            Adicionar
          </button>
          <button
            className={styles.confirmar}
            onClick={() => onConfirm(locaisInternos)}
            disabled={locaisInternos.length === 0 || somaQuantidades !== qtdeRestante}
          >
            Confirmar Tudo
          </button>
        </div>
      </div>
      {indexParaRemover !== null && (
        <div className={styles.confirmBackdrop}>
          <div className={styles.confirmBox}>
            <p>Deseja remover o local <strong>{localParaRemover}</strong>?</p>
            <div className={styles.confirmActions}>
              <button onClick={() => {
                removerLocal(indexParaRemover);
                setIndexParaRemover(null);
                setLocalParaRemover(null);
              }}>
                Sim
              </button>
              <button onClick={() => {
                setIndexParaRemover(null);
                setLocalParaRemover(null);
              }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalReserva;
