"use client"
import Botao from "@/components/Botao/Botao";
import style from './LoginColetor.module.scss'
import { dbChecklist } from "@/utils/api/axios";
import { sessaoOperador } from "@/utils/auth/storageService";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Operador } from "@/types/Operador";
import { useRouter } from "next/navigation";
import Modal from "@/components/ModalPadrao/ModalPadrao";

export default function LoginColetor() {
    const [matricula, setMatricula] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const router = useRouter();
    const refMatricula = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(refMatricula.current) refMatricula.current.focus()
        if(matricula === '') sessaoOperador.delete();
    },[])
    
    function entrar(e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>){
        if(e){
            e.preventDefault();
            if(matricula){
                dbChecklist.post('api/login',{matricula: `${matricula}`})
                .then( res => {
                    if(res.status === 200){                    
                        var operador: Operador
                        operador = JSON.parse(res.data.operador)
                        console.log('DADOS: '+ res.data.operador)
                        sessaoOperador.save(String(operador.cracha), operador.nome);
                        router.push(`home`)
                    }
                })
                .catch(error => {
                    setModalMessage("Usuário não encontrado.")
                    setShowModal(true);
                    console.log('Falha ao efetuar login: ', error);
                });   
            }
            else{
                setModalMessage("Preencha o campo corretamente.")
                setShowModal(true);
            } 
        }else{
            console.log('Evento Não encontrado');
        }
    }     
    return(
        <html>
            <body>
                <div className={style.loginColetorPage}>
                        <div className={style.box}>
                            <form onSubmit={(e) => entrar(e)}>
                                <label>MATRÍCULA DO OPERADOR:</label>
                                <input ref={refMatricula} type='text' placeholder='' value={matricula} onChange={(e) => setMatricula(e.target.value)} required/>
                                <Botao size='fullSize' type='submit' onClick={(e) => entrar(e)}> ENTRAR </Botao> 
                            </form>
                        </div>
                </div>
                {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}
            </body>
        </html>
    );
}
