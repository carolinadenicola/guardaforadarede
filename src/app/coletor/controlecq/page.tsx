"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaRegQuestionCircle, FaSpinner } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { IoWarningOutline } from "react-icons/io5";
import ModalPadrao from "@/components/ModalPadrao/ModalPadrao";
import ModalConfirmar from "@/components/ModalConfirmar/ModalConfirmar";
import styles from "./Controlecq.module.scss";
import { APITotvs } from "@/utils/api/endpointsTotvs";
import { AxiosError } from "axios";
import { ItemColetor } from "@/types/ItemColetor";
import ModalVariosBotoes from "@/components/ModalVariosBotoes/ModalVariosBotoes";
import ModalAutenticacao from "@/components/ModalAutenticacao/ModalAutenticacao";
import ModalQuantidade from "@/components/ModalQuantidade/ModalQuantidade";

export default function ControleCQ() {
  const [itens, setItens] = useState<ItemColetor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [corIcone, setCorIcone] = useState("");
  const [modalIcon, setModalIcon] = useState<React.ReactNode>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<ItemColetor | null>(null);
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    carregarItens();
  }, []);

  const carregarItens = async () => {
    try {
      setIsLoading(true);
      const response = await APITotvs.post("/guardaMaterial/listaDocumento", {
        status: 2, 
      });

      console.log("Resposta da API:", response.data);

      const itensFiltrados: ItemColetor[] = response.data?.documentos?.map((item: any) => ({
        codigoItem: item.item,
        codigoInteiro: item.documento,
        qtdeAtual: 0,
        qtdeFinal: item.quantidade ?? 0,
        status: item.status,
        localizacao: item.localizacao,
        local: item.localizacao,
      })) || [];
      

      setItens(itensFiltrados);
    } catch (error) {
      console.error("Erro ao carregar itens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const abrirModalAcao = (item: ItemColetor) => {
    setItemSelecionado(item);
    setShowActionModal(true);
  };

  const trocaModalParcial = () => {
    setShowActionModal(false);
    setShowAuthModal(true);
  };


  const atualizarStatus = async (novoStatus: number) => {
    if (!itemSelecionado) return;

    try {
      let usuarioLogado = "jgriti";
      let obs = "";

      const payload = {
        documentos: [{ chaveDocumento: itemSelecionado.codigoInteiro, usuario: usuarioLogado, novoStatus: novoStatus }],
      };

      console.log("Payload enviado:", JSON.stringify(payload, null, 2));

      const response = await APITotvs.post("/guardaMaterial/mudaStatus", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setItens((prevItens) =>
          prevItens.filter((item) => item.codigoInteiro !== itemSelecionado.codigoInteiro)
        );

        setModalIcon(<CiLogin />);
        setCorIcone("#009951");
        setModalMessage(
          novoStatus === 1
            ? "Item liberado para guarda com sucesso."
            : "Item barrado no Controle de Qualidade."
        );
        setShowModal(true);
        carregarItens();
      } else {
        setModalIcon(<IoWarningOutline />);
        setCorIcone("#E46962");
        setModalMessage("Erro ao atualizar o status do item.");
        setShowModal(true);
      }
    } catch (error) {
      setModalIcon(<IoWarningOutline />);
      setCorIcone("#E46962");

      let errorMessage = "Erro desconhecido";
      if (error instanceof AxiosError && error.response) {
        errorMessage = error.response.data?.message || "Erro desconhecido no servidor";
      }

      setModalMessage(`Erro ao atualizar o status do item.\nMensagem: ${errorMessage}`);
      setShowModal(true);
    }

    setShowActionModal(false);
  };


  const autenticarUsuario = (matricula: string, senha: string) => {
    if (matricula === "admin" && senha === "1234") { // Simulação de admin
      setShowAuthModal(false);
      setShowQuantityModal(true);
    } else {
      setModalIcon(<IoWarningOutline />);
      setCorIcone("#E46962");
      setModalMessage("Acesso negado! Matrícula ou senha incorreta.");
      setShowModal(true);
    }
  };

  const atualizarStatusParcial = async (qtd: number, obs: string) => {
    if (!itemSelecionado) return;

    try {
      let usuarioLogado = "jgriti";

      const payload = {
        documentos: [{ 
          chaveDocumento: itemSelecionado.codigoInteiro, 
          usuario: usuarioLogado, 
          novoStatus: 1, 
          observacao: obs, 
          quantidadeTransferencia: qtd, 
          parcial: true }],
      };

      console.log(payload)

      const respostaAPI = await APITotvs.post("/guardaMaterial/mudaStatus", payload, { headers: { "Content-Type": "application/json" } });
      
      console.log(respostaAPI);

      if (respostaAPI.data?.erros?.length > 0) {
        setModalIcon(<IoWarningOutline />);
        setCorIcone("#E46962");
        setModalMessage(`Erro ao transferir parcial: ${respostaAPI.data.erros[0].mensagem}`);
        setShowQuantityModal(false);
        setShowModal(true);
        return;
      }

      if (respostaAPI.data?.sucesso?.length > 0) {
        setModalIcon(<CiLogin />);
        setCorIcone("#009951");
        setModalMessage(`Item ${itemSelecionado.codigoItem} liberado para guarda com quantidade ${qtd}.`);
        setShowQuantityModal(false);
        setShowModal(true);
        carregarItens();
        return;
      }

      setModalIcon(<IoWarningOutline />);
      setCorIcone("#E46962");
      setModalMessage("Resposta inesperada da API. Nenhum erro ou sucesso identificado.");
      setShowQuantityModal(false);
      setShowModal(true);

    } catch (error) {
      let errorMessage = "Erro desconhecido";
      if (error instanceof AxiosError && error.response) {
        errorMessage = error.response.data?.message || "Erro desconhecido no servidor";
      }
  
      setModalMessage(`Erro ao transferir parcial.\nMensagem: ${errorMessage}`);
      setShowModal(true);
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>CONTROLE DE QUALIDADE</h1>
        <button className={styles.voltar} onClick={() => window.history.back()}>
          <FaArrowLeft size={20} color="#34408E" />
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.spinner} />
          <p>Carregando itens...</p>
        </div>
          ) : itens.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>ITEM</th>
                    <th className={styles.th}>QTDE</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item, index) => (
                    <tr
                      key={`${item.codigoInteiro}-${index}`}
                      className={styles.cinza}
                      onClick={() => abrirModalAcao(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{item.codigoItem}</td>
                      <td>{item.qtdeFinal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.mensagemVazia}>Não existem itens com status "Controle de Qualidade".</p>
        )}

      {/* Modal de Ações */}
      {showActionModal && itemSelecionado && (
        <ModalVariosBotoes
          icon={<FaRegQuestionCircle />}
          iconColor="black"
          message={`O que deseja fazer com o item "${itemSelecionado.codigoInteiro}"?`}
          onClose={() => setShowActionModal(false)}
          buttons={[
            { label: "Liberar Para Guarda", action: () => atualizarStatus(1), color: "green" },
            { label: "Negar CQ", action: () => atualizarStatus(4), color: "red" },
            { label: "Liberação Parcial", action: () => trocaModalParcial(), color: "blue" },
          ]}
        />
      )}

      {/*Modal de Liberação Parcial*/}
      {showPartialModal && (
        <ModalVariosBotoes
          icon={<FaRegQuestionCircle />}
          iconColor="black"
          message={`Definir quantidade para liberar do item "${itemSelecionado?.codigoInteiro}"`}
          onClose={() => setShowPartialModal(false)}
          buttons={[
            { label: "Confirmar", action: () => console.log("Liberação parcial implementada"), color: "blue" },
          ]}
        />
      )}

      {showModal && (
        <ModalPadrao
          icon={modalIcon}
          iconColor={corIcone}
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
      
      {showAuthModal && <ModalAutenticacao onClose={() => setShowAuthModal(false)} onAuthenticate={autenticarUsuario} />}
      {showQuantityModal && itemSelecionado && (
        <ModalQuantidade onClose={() => setShowQuantityModal(false)} onConfirm={(quantidade, observacao) => atualizarStatusParcial(quantidade, observacao)} qtdeMaxima={itemSelecionado.qtdeFinal} />
      )}
      {showActionModal && itemSelecionado && (
        <ModalVariosBotoes
          icon={<FaRegQuestionCircle />}
          iconColor="black"
          message={`O que deseja fazer com o item "${itemSelecionado.codigoInteiro}"?`}
          onClose={() => setShowActionModal(false)}
          buttons={[
            { label: "Liberar Para Guarda", action: () => atualizarStatus(1), color: "#009951" },
            { label: "Negar CQ", action: () => atualizarStatus(4), color: "#E46962" },
            { label: "Liberação Parcial", action: () => trocaModalParcial(), color: "#34408E" },
          ]}
        />
      )}

      
    </div>
  );
}
