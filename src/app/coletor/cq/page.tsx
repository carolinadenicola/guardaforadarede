"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaRegEdit, FaRegQuestionCircle } from "react-icons/fa";
import { CiLogin, CiCircleRemove  } from "react-icons/ci";
import { IoWarningOutline } from "react-icons/io5";
import { mockData } from "@/testUtils/mockups/mockData";
import { ItemColetor } from "@/types/ItemColetor";
import ModalPadrao from "@/components/ModalPadrao/ModalPadrao";
import ModalEditar from "@/components/ModalEditar/ModalEditar";
import ModalConfirmar from "@/components/ModalConfirmar/ModalConfirmar";
import styles from "./CQ.module.scss";
import { AxiosError } from "axios";
import { APITotvs } from "@/utils/api/endpointsTotvs";
import ComProtecao from "@/components/ComProtecao/ComProtecao";
import { sessaoOperador } from "@/utils/auth/storageService";

export default function ControleQualidade() {
  const [codigoItem, setCodigoItem] = useState("");
  const [itens, setItens] = useState<ItemColetor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [corIcone, setCorIcone] = useState("");
  const [modalIcon, setModalIcon] = useState<React.ReactNode>(null);
  const [dadosApi, setDadosApi] = useState<ItemColetor[]>([]); // Substitui mockData
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemEditando, setItemEditando] = useState<ItemColetor | null>(null); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     setDadosApi(mockData);
  //   };

  //   fetchData();
  // }, []);

  const abrirModalConfirmacao = () => {
    if (itens.length > 0) {
      setShowConfirmModal(true);
    } else {
      confirmarSaida();
    }
  };
  
  const fecharModalConfirmacao = () => {
    setShowConfirmModal(false);
  };
  
  const confirmarSaida = () => {
    window.history.back();
  };

  const abrirModalEdicao = (item: ItemColetor) => {
    setItemEditando(item);
    setShowEditModal(true);
  };
  
  const fecharModalEdicao = () => {
    setItemEditando(null);
    setShowEditModal(false);
  };
  
  const confirmarEdicao = (qtdeAtual: number) => {
    if (itemEditando) {
      if (qtdeAtual > itemEditando.qtdeFinal) {        
        fecharModalEdicao();
        setModalIcon(<IoWarningOutline />);
        setCorIcone("#E46962");
        setModalMessage(
          `Quantidade maior do que a total esperada.\nEsperada: ${itemEditando.qtdeFinal}\nInserida: ${qtdeAtual}`
        );
        setShowModal(true);
        return;
      }
      setItens((prevItens) =>
        prevItens.map((i) =>
          i.codigoInteiro === itemEditando.codigoInteiro ? { ...i, qtdeAtual } : i
        )
      );
    }
    fecharModalEdicao();
  };

  const adicionarItem = async () => {
    try {

      // Extraindo o código do item e a quantidade corretamente
      if (!codigoItem.includes("|") || !codigoItem.includes("/")) {
        setModalIcon(<IoWarningOutline />);
        setCorIcone("#E46962");
        setModalMessage(`Formato inválido do código: ${codigoItem}`);
        setShowModal(true);
        return;
      }

      const [codigoItemBase, resto] = codigoItem.split("|");
      const [quantidadeStr, informacoesNota] = resto.split("/");

      const quantidadeParaContar = parseInt(quantidadeStr, 10);

      if (isNaN(quantidadeParaContar) || quantidadeParaContar <= 0) {
        setModalIcon(<IoWarningOutline />);
        setCorIcone("#E46962");
        setModalMessage(`Quantidade inválida no código: ${codigoItem}`);
        setShowModal(true);
        return;
      }

      const chaveDocumentoReconstruida = `${codigoItemBase}/${informacoesNota}`;
     
      const itemExistente = itens.find((item) => item.codigoInteiro === chaveDocumentoReconstruida);
  
      if (itemExistente) {
        if ((itemExistente.qtdeAtual ?? 0) < itemExistente.qtdeFinal) {          
          setItens((prevItens) =>
            prevItens.map((item) =>
              item.codigoInteiro === chaveDocumentoReconstruida
                ? { ...item, qtdeAtual: (item.qtdeAtual ?? 0) + 1 }
                : item
            )
          );
          setCodigoItem("");
          return;
        } else {
          setModalIcon(<CiCircleRemove />);
          setCorIcone("#E46962");
          setModalMessage(`Item ${chaveDocumentoReconstruida} já foi adicionado corretamente.`);
          setShowModal(true);
          setCodigoItem("");
          return;
        }
      }
  
      const payloadBusca = {
        documentos: [
          {
            chaveDocumento: chaveDocumentoReconstruida,
          },
        ],
      };
      
      console.log("Payload enviado:", JSON.stringify(payloadBusca, null, 2));
      const response = await APITotvs.post("/guardaMaterial/buscaDocumento", JSON.stringify(payloadBusca), {
        headers: { "Content-Type": "application/json" },
      });
  
      const documento = response.data.documentos?.[0];
  
      if (documento) {
        if (documento.status === 0) {
          setItens((prevItens) => [
            ...prevItens,
            {
              codigoItem: documento.item,
              codigoInteiro: documento.documento,
              qtdeAtual: quantidadeParaContar,
              qtdeFinal: documento.quantidade,
              status: documento.status,
              descricao: documento.descricaoItem,
            },
          ]);
        } else {          
          setModalIcon(<IoWarningOutline />);
          setCorIcone("#E46962");
  
          let nomeStatus = "Desconhecido";
          switch (documento.status) {
            case 0:
              nomeStatus = "Recebimento";
              break;
            case 1:
              nomeStatus = "Liberado Para Guarda";
              break;
            case 2:
              nomeStatus = "Controle de Qualidade";
              break;
            case 3:
              nomeStatus = "Em Transporte";
              break;
            case 99:
              nomeStatus = "Estoque";
              break;
          }
  
          setModalMessage(`Item ${documento.item} não possui o status "Recebimento".\nStatus Atual: ${nomeStatus}`);
          setShowModal(true);
        }
      } else {
        setModalIcon(<IoWarningOutline />);
        setCorIcone("#E46962");
        setModalMessage(`O item ${chaveDocumentoReconstruida} não foi encontrado.`);
        setShowModal(true);
      }
    } catch (error) {
      setModalIcon(<IoWarningOutline />);
      setCorIcone("#E46962");
  
      let errorMessage = "Erro desconhecido";
      if (error instanceof AxiosError && error.response) {
        errorMessage = error.response.data?.message || "Erro desconhecido no servidor";
      }
  
      setModalMessage(`Erro ao buscar o item ${codigoItem}.\nMensagem: ${errorMessage}`);
      setShowModal(true);
    }
  
    setCodigoItem("");
  };
  

  const finalizarProcesso = async () => {
    const itensFaltando = itens.some((item) => (item.qtdeAtual || 0) < item.qtdeFinal);
    
    let usuarioLogado = sessaoOperador.getMatriculaOperador();
  
    if (itensFaltando) {
      setModalIcon(<IoWarningOutline />);
      setCorIcone("#E46962");
      setModalMessage("Itens faltando, verifique as linhas amarelas e tente novamente.");
      setShowModal(true);
      return;
    }
  
    const payload = {
      documentos: itens.map((item) => ({
        chaveDocumento: item.codigoInteiro,
        novoStatus: 2,
        usuario: usuarioLogado,
      })),
    };

    console.log("Payload enviado:", JSON.stringify(payload, null, 2));

  
    try {
      const response = await APITotvs.post("/guardaMaterial/mudaStatus", JSON.stringify(payload), {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {        
        setItens([]);
        setModalIcon(<CiLogin />);
        setCorIcone("#009951");
        setModalMessage("STATUS DOS ITENS ALTERADOS PARA 'CONTROLE DE QUALIDADE'.");
        setShowModal(true);
      } else {
        // Falha: exibe a modal de erro e mantém a lista
        setModalIcon(<IoWarningOutline />);
        setCorIcone("#E46962");
        setModalMessage("Erro ao atualizar o status dos itens. Tente novamente.");
        setShowModal(true);
      }
    } catch (error) {
      // Tratamento de erro em caso de falha na chamada à API
      setModalIcon(<IoWarningOutline />);
      setCorIcone("#E46962");
  
      let errorMessage = "Erro desconhecido";
      if (error instanceof AxiosError && error.response) {
        errorMessage = error.response.data?.message || "Erro desconhecido no servidor";
      }
  
      setModalMessage(`Erro ao atualizar o status dos itens.\nMensagem: ${errorMessage}`);
      setShowModal(true);
    }
  };
  
  return (
    <ComProtecao>
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>ENVIAR PARA CQ</h1>
        <button className={styles.voltar} onClick={abrirModalConfirmacao}>
          <FaArrowLeft size={20} color="#34408E" />
        </button>
      </div>

      <div className={styles.inputContainer}>
        <label htmlFor="codigoItem">ITEM</label>
        <input
          id="codigoItem"
          type="text"
          value={codigoItem}
          onChange={(e) => setCodigoItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && adicionarItem()}
          placeholder="Leia ou digite o código do item"
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>ITEM</th>
              <th className={styles.th}>QTDE. ATUAL</th>
              <th className={styles.th}>QTDE. FINAL</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item, index) => {
              const corLinha =
                item.qtdeAtual === item.qtdeFinal
                  ? styles.verde
                  : styles.amarelo;

              const isFirst = index === 0;
              const isLast = index === itens.length - 1;

              return (
                <tr key={item.codigoInteiro} className={corLinha}>
                  <td
                    className={`${isFirst ? styles["rounded-top-left"] : ""} ${
                      isLast ? styles["rounded-bottom-left"] : ""
                    }`}
                  >
                    {item.codigoItem}
                  </td>
                  <td>{item.qtdeAtual}</td>
                  <td>
                    {item.qtdeFinal}
                  </td>
                  <td
                    className={`${isFirst ? styles["rounded-top-right"] : ""} ${
                      isLast ? styles["rounded-bottom-right"] : ""
                    }`}
                  >
                    {item.qtdeFinal > 20 && (
                      <button
                        className={styles.editButton}
                        onClick={() => abrirModalEdicao(item)}
                      >
                      <FaRegEdit />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <button onClick={finalizarProcesso}>FINALIZAR</button>
      </div>

      {showModal && (
        <ModalPadrao
          icon={modalIcon}
          iconColor={corIcone}
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}

      {showEditModal && itemEditando && (
        <ModalEditar
          icon={<FaRegEdit />}
          iconColor="#FFCC00"
          message={"Alterar quantidade manualmente"}
          qtdeAtualInicial={itemEditando.qtdeAtual || 0}
          onClose={fecharModalEdicao}
          onConfirm={confirmarEdicao}
        />
      )}

      {showConfirmModal && (
        <ModalConfirmar
          icon={<FaRegQuestionCircle  />}
          iconColor="black"
          message={"Tem certeza de que deseja retornar ao menu inicial?\nTODO PROGRESSO SERÁ PERDIDO"}
          onClose={fecharModalConfirmacao}
          onConfirm={confirmarSaida}
        />
      )}
    </div>
    </ComProtecao>
  );
}
