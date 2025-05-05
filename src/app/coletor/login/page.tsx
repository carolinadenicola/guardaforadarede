"use client"
import Botao from "@/components/Botao/Botao";
import style from './LoginColetor.module.scss';
import { APITotvs } from "@/utils/api/endpointsTotvs";
import { sessaoOperador } from "@/utils/auth/storageService";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ModalPadrao/ModalPadrao";

export default function LoginColetor() {
    const [matricula, setMatricula] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const router = useRouter();
    const refMatricula = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (refMatricula.current) refMatricula.current.focus();
        if (matricula === '') sessaoOperador.delete();
    }, []);

    async function entrar(e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        if (!matricula) {
            setModalMessage("Preencha o campo corretamente.");
            setShowModal(true);
            return;
        }

        //Sessão mockada
        // sessaoOperador.save('4711', 'Carol', 'cnicola', 3)

        try {
            const res = await APITotvs.get(`/guardaMaterial/matricula?matricula=${matricula}`);
            const dados = res.data?.sucesso?.[0];

            if (!dados) {
                setModalMessage("Usuário não encontrado.");
                setShowModal(true);
                return;
            }

            if (dados.situacao === 0) {
                setModalMessage("Usuário desativado, contate o administrador.");
                setShowModal(true);
                return;
            }

            sessaoOperador.save(String(dados.matricula), dados.nome, dados.usuarioDatasul, dados.tipo);
            router.push("home");

        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            setModalMessage("Erro ao buscar usuário. Tente novamente mais tarde.");
            setShowModal(true);
        }
    }

    return (
        <html>
            <body>
                <div className={style.loginColetorPage}>
                    <div className={style.box}>
                        <form onSubmit={entrar}>
                            <label>MATRÍCULA DO OPERADOR:</label>
                            <input
                                ref={refMatricula}
                                type='text'
                                value={matricula}
                                onChange={(e) => setMatricula(e.target.value)}
                                required
                            />
                            <Botao size='fullSize' type='submit' onClick={entrar}> ENTRAR </Botao>
                        </form>
                    </div>
                </div>
                {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}
            </body>
        </html>
    );
}
