"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaExclamationCircle, FaRegEdit, FaRegQuestionCircle } from "react-icons/fa";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { CiLogin, CiCircleRemove  } from "react-icons/ci";
import { CgDanger } from "react-icons/cg";
import { IoWarningOutline } from "react-icons/io5";
import { mockData } from "@/testUtils/mockups/mockData";
import { ItemColetor } from "@/types/ItemColetor";
import ModalPadrao from "@/components/ModalPadrao/ModalPadrao";
import ModalEditar from "@/components/ModalEditar/ModalEditar";
import ModalConfirmar from "@/components/ModalConfirmar/ModalConfirmar";
import styles from "./Transporte.module.scss";
import { AxiosError } from "axios";
import { APITotvs } from "@/utils/api/endpointsTotvs";
import ModalAutenticacao from "@/components/ModalAutenticacao/ModalAutenticacao";
import ModalQuantidade from "@/components/ModalQuantidade/ModalQuantidade";
import ComProtecao from "@/components/ComProtecao/ComProtecao";
import bcrypt from "bcryptjs";
import { sessaoOperador } from "@/utils/auth/storageService";

export default function Transporte() {
  const [codigoItem, setCodigoItem] = useState("");
  const [itens, setItens] = useState<ItemColetor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [corIcone, setCorIcone] = useState("");
  const [modalIcon, setModalIcon] = useState<React.ReactNode>(null);
  const [dadosApi, setDadosApi] = useState<ItemColetor[]>([]); // Substitui mockData
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemEditando, setItemEditando] = useState<ItemColetor | null>(null); 
  const [itemSelecionado, setItemSelecionado] = useState<ItemColetor | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const abrirModalAutenticacao = (item: ItemColetor) => {
    setItemSelecionado(item);
    setShowAuthModal(true);
  };

  const fecharModalAutenticacao = () => {
    setShowAuthModal(false);
  };

  const abrirModalParcial = (item: ItemColetor) => {
    setShowPartialModal(true);
  };

  const fecharModalParcial = () => {
    setShowPartialModal(false);
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

  const autenticarUsuario = async (matricula: string, senha: string) => {
    try {
      const res = await APITotvs.get(`/guardaMaterial/matricula?matricula=${matricula}`);
      const usuario = res.data?.sucesso?.[0];

      if (!usuario) {
        setModalIcon(<IoWarningOutline />);
        setCorIcone("#E46962");
        setModalMessage("Usuário não encontrado");
        setShowModal(true);
        return;
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        setModalIcon(<IoWarningOutline />);
        setCorIcone("#E46962");
        setModalMessage("Senha incorreta");
        setShowModal(true);
        return;
      }

      if (usuario.tipo !== 2 && usuario.tipo !== 3) {
        setModalIcon(<IoWarningOutline />);
        setCorIcone("#E46962");
        setModalMessage("Usuário não possui permissão para prosseguir");
        setShowModal(true);
        return;
      }

      setShowAuthModal(false);
      setShowPartialModal(true);
    } catch (error) {
      setModalIcon(<IoWarningOutline />);
      setCorIcone("#E46962");
      setModalMessage("Erro ao autenticar usuário. Tente novamente.");
      setShowModal(true);
    }
  }; 

  const adicionarItem = async () => {
    try {      
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
            const novaQuantidade = (itemExistente.qtdeAtual ?? 0) + quantidadeParaContar;

            if (novaQuantidade > itemExistente.qtdeFinal) {
                console.log("entrou em novaQuantidade > itemExistente.qtdeFinal")
                setModalIcon(<IoWarningOutline />);
                setCorIcone("#E46962");
                setModalMessage(
                    `Quantidade excedida!\nMáximo permitido: ${itemExistente.qtdeFinal}\nTentativa: ${novaQuantidade}`
                );
                setShowModal(true);
                setCodigoItem("");
                return;
            }

            setItens((prevItens) =>
                prevItens.map((item) =>
                    item.codigoInteiro === chaveDocumentoReconstruida
                        ? { ...item, qtdeAtual: novaQuantidade }
                        : item
                )
            );

            setCodigoItem("");
            return;
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
        console.log(documento.status)


        if(documento.quantidadeTransferencia < quantidadeParaContar){
          if(documento.status === 2){
            setModalIcon(<IoWarningOutline />);
            setCorIcone("#E46962");
            setModalMessage(`Item ${documento.item} não possui o status "Liberado Para Guarda".\nStatus Atual: Controle de Qualidade`);
            setShowModal(true);
            return;
          }
          setModalIcon(<IoWarningOutline />);
          setCorIcone("#E46962");
          setModalMessage(
            `Quantidade excedida!\nMáximo permitido: ${documento.quantidadeTransferencia}\nTentativa: ${quantidadeParaContar}`
          );
          setShowModal(true);
          return;
        }

        if (documento.status === 1) {
          setItens((prevItens) => [
            ...prevItens,
            {
              codigoItem: documento.item,
              codigoInteiro: documento.documento,
              local: documento.localizacao,
              qtdeAtual: quantidadeParaContar,
              qtdeFinal: documento.quantidadeTransferencia,
              status: documento.status,
            },
          ]);        
        } else {
          // Status inválido, exibe modal informando o status atual
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
  
          setModalMessage(`Item ${documento.item} não possui o status "Liberado Para Guarda".\nStatus Atual: ${nomeStatus}`);
          setShowModal(true);
        }
      } else {
        // Item não encontrado na API
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
        novoStatus: 3,
        quantidadeTransferencia: item.qtdeAtual,
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
        setModalMessage("STATUS DOS ITENS ALTERADOS PARA 'EM TRANSPORTE'.");
        setShowModal(true);
      } else {
        setModalIcon(<IoWarningOutline />);
        setCorIcone("#E46962");
        setModalMessage("Erro ao atualizar o status dos itens. Tente novamente.");
        setShowModal(true);
      }
    } catch (error) {
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

  const confirmarRetrabalho = async (qtd: number, obs: string) => {
    if (!itemSelecionado) return;

    try {
      let usuarioLogado = sessaoOperador.getMatriculaOperador();

      const payload = {
        documentos: [{ chaveDocumento: itemSelecionado.codigoInteiro, usuario: usuarioLogado, novoStatus: 5, observacao: obs, quantidadeTransferencia: qtd}],
      };

      console.log(payload)

      const respostaAPI = await APITotvs.post("/guardaMaterial/mudaStatus", payload, { headers: { "Content-Type": "application/json" } });
      
      console.log(respostaAPI);

      if (respostaAPI.data?.erros?.length > 0) {
        setModalIcon(<IoWarningOutline />);
        setCorIcone("#E46962");
        setModalMessage(`Erro ao transferir para Reconferência: ${respostaAPI.data.erros[0].mensagem}`);
        setShowPartialModal(false);
        setShowModal(true);
        return;
      }

      if (respostaAPI.data?.sucesso?.length > 0) {
        setItens((prevItens) =>
          prevItens.filter((item) => item.codigoInteiro !== itemSelecionado.codigoInteiro)
        );

        setModalIcon(<CiLogin />);
        setCorIcone("#009951");
        setModalMessage(`Item ${itemSelecionado.codigoItem} movido para Reconferência`);
        setShowPartialModal(false);
        setShowModal(true);
        return;
      }

      setModalIcon(<IoWarningOutline />);
      setCorIcone("#E46962");
      setModalMessage("Resposta inesperada da API. Nenhum erro ou sucesso identificado.");
      setShowPartialModal(false);
      setShowModal(true);

    } catch (error) {
      let errorMessage = "Erro desconhecido";
      if (error instanceof AxiosError && error.response) {
        errorMessage = error.response.data?.message || "Erro desconhecido no servidor";
      }
  
      setModalMessage(`Erro ao transferir para Reconferência.\nMensagem: ${errorMessage}`);
      setShowModal(true);
    }
  };

  return (
    <ComProtecao>
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>INICIAR TRANSPORTE</h1>
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
              <th className={styles.th}>LOCAL</th>
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
                  <td>{item.local}</td>
                  <td>{item.qtdeAtual}</td>
                  <td>
                    {item.qtdeFinal}
                  </td>
                  <td
                    className={`${isFirst ? styles["rounded-top-right"] : ""} ${
                      isLast ? styles["rounded-bottom-right"] : ""
                    }`}
                  >
                    <div className={styles.btnReconferencia}>
                      <button
                        className={styles.editButton}
                        onClick={() => abrirModalAutenticacao(item)}
                      >
                        <FaExclamationCircle />
                      </button>
                    </div>

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

      {/* {showEditModal && itemEditando && (
        <ModalEditar
          icon={<FaRegEdit />}
          iconColor="#FFCC00"
          message={"Alterar quantidade manualmente"}
          qtdeAtualInicial={itemEditando.qtdeAtual || 0}
          onClose={fecharModalEdicao}
          onConfirm={confirmarEdicao}
        />
      )} */}

      {showConfirmModal && (
        <ModalConfirmar
          icon={<FaRegQuestionCircle  />}
          iconColor="black"
          message={"Tem certeza de que deseja retornar ao menu inicial?\nTODO PROGRESSO SERÁ PERDIDO"}
          onClose={fecharModalConfirmacao}
          onConfirm={confirmarSaida}
        />
      )}

        {showPartialModal && itemSelecionado && (
          <ModalQuantidade
            onClose={() => setShowPartialModal(false)}
            onConfirm={(quantidade, observacao) => confirmarRetrabalho(quantidade, observacao)}
            qtdeMaxima={itemSelecionado.qtdeFinal}
            quantidadeFixa={itemSelecionado.qtdeFinal}
            titulo={'Enviar para Reconferência'} 
            modo={"reconferencia"}
          />
        )}

      {/* Modal de Autenticação (para retornar status) */}
      {showAuthModal && (
        <ModalAutenticacao onClose={() => setShowAuthModal(false)} onAuthenticate={autenticarUsuario} />
      )}

    </div>
    </ComProtecao>
  );
}
