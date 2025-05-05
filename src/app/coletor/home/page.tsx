"use client"
import Botao from "@/components/Botao/Botao";
import style from './HomeColetor.module.scss'
import { dbChecklist } from "@/utils/api/axios";
import { sessaoOperador } from "@/utils/auth/storageService";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Operador } from "@/types/Operador";
import { useRouter } from "next/navigation";
import Modal from "@/components/ModalPadrao/ModalPadrao";
import ComProtecao from "@/components/ComProtecao/ComProtecao";

export default function HomeColetor() {
    const [matricula, setMatricula] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [operador, setOperador] = useState({matricula: '', nome: ''})
    const router = useRouter();
    const refMatricula = useRef<HTMLInputElement>(null);

          
        useEffect(() => {
          if(operador.matricula === ''){
              const storedNome: string | null = sessaoOperador.getNomeOperador();
              const nome = storedNome ? storedNome : '';
              const storedMatricula: string | null = sessaoOperador.getMatriculaOperador();
              const matricula = storedMatricula ? storedMatricula : '';
              setOperador({matricula: matricula, nome: nome});
            }
          }, []);
      
        function logout(){
          sessaoOperador.delete();
          router.push('login')
        }

        const redirecionar = (rota: string) => {
            router.push(rota);
        };

    return(
        <ComProtecao>
        <html>
            <body>
                <div className={style.homeColetorPage}>
                        <div className={style.box}>
                            <label>{operador.matricula} - {operador.nome}</label>
                            <div className={style.botoesLinha}>
                                <div className={style.botoesIndividuaisEsquerda}>
                                    <Botao size='fullSize' type='button' onClick={() => redirecionar("/coletor/liberarparaguarda")}> LIBERAR PARA GUARDA </Botao> 
                                </div>
                                <div className={style.botoesIndividuaisDireita}>
                                    <Botao size='fullSize' type='button' onClick={() => redirecionar("/coletor/controlecq")}> CONTROLE CQ </Botao> 
                                </div>
                            </div>
                            <div className={style.botoesLinha}>
                                <div className={style.botoesIndividuaisEsquerda}>
                                    <Botao size='fullSize' type='button' onClick={() => redirecionar("/coletor/transporte")}> TRANSPORTE </Botao> 
                                </div>
                                <div className={style.botoesIndividuaisDireita}>
                                    <Botao size='fullSize' type='button' onClick={() => redirecionar("/coletor/estoque")}> ESTOQUE </Botao> 
                                </div>
                            </div>  
                            <div className={style.botoesLinha}>
                                <div className={style.botoesIndividuaisEsquerda} style={{ visibility: "hidden" }}>
                                    <Botao size='fullSize' type='button' onClick={() => redirecionar("/coletor/cq")}> CONTROLE DE QUALIDADE </Botao> 
                                </div>
                                <div className={style.botoesIndividuaisDireita} style={{ visibility: "hidden" }}>
                                    <Botao size='fullSize' type='button' onClick={() => redirecionar("/coletor/estoque")}> ESTOQUE </Botao> 
                                </div>
                            </div>                            
                            <div className={style.botaoSair}>
                                <Botao size='fullSize' type='button' onClick={(e) => logout()}> SAIR </Botao> 
                            </div>
                        </div>
                </div>
                {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}
            </body>
        </html>
        </ComProtecao>
    );

}
