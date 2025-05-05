"use client"
import Botao from "@/components/Botao/Botao";
import style from './Cadastro.module.scss'
import { dbChecklist } from "@/utils/api/axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import Modal from "@/components/ModalPadrao/ModalPadrao";
import bcrypt from "bcryptjs";
import { Usuario } from "@/types/Usuario";
import { APITotvs } from "@/utils/api/endpointsTotvs";
import ComProtecao from "@/components/ComProtecao/ComProtecao";
import { sessaoOperador } from "@/utils/auth/storageService";
import { useRouter } from "next/navigation";


export default function Cadastro() {
    const router = useRouter();
    const [form, setForm] = useState<Usuario & { confirmarSenha: string }>({
        matricula: '',
        usuarioDatasul: '',
        tipo: 1,
        situacao: 1,
        nome: '',
        senha: '',
        confirmarSenha: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [senhaMatch, setSenhaMatch] = useState<boolean | null>(null);
    const refMatricula = useRef<HTMLInputElement>(null);
    const [showRestricao, setShowRestricao] = useState(false);

    useEffect(() => {
        const matricula = sessaoOperador.getMatriculaOperador();
        const tipo = Number(sessaoOperador.getTipoOperador());
      
        if (!matricula || tipo !== 3) {
          setShowRestricao(true);
        }
      }, []);

    useEffect(() => {
        if(refMatricula.current) refMatricula.current.focus();
    },[])

    useEffect(() => {
        if (form.senha && form.confirmarSenha) {
            setSenhaMatch(form.senha === form.confirmarSenha);
        } else {
            setSenhaMatch(null);
        }
    }, [form.senha, form.confirmarSenha]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const val = name === 'tipo' || name === 'situacao' ? Number(value) : value;
        setForm({ ...form, [name]: val });
    }

    const validarSenha = (senha: string): boolean => {
        const regex = /^\d{6}$/;
        return regex.test(senha);
    }

    const camposPreenchidos = (): boolean => {
        return (
            form.matricula !== '' &&
            form.usuarioDatasul !== '' &&
            form.nome !== '' &&
            validarSenha(form.senha) &&
            senhaMatch === true &&
            (form.tipo === 1 || form.tipo === 2 || form.tipo === 3) &&
            (form.situacao === 0 || form.situacao === 1)
        );
    }       
    

    const cadastrar = async (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (!camposPreenchidos()) {
            setModalMessage("Preencha todos os campos corretamente.");
            setShowModal(true);
            return;
        }

        try {
            const senhaCriptografada = await bcrypt.hash(form.senha, 10);
            const { confirmarSenha, ...resto } = form;
            const payload: Usuario = {
                ...resto,
                senha: senhaCriptografada
            };

            console.log(payload);

            const res = await APITotvs.post("/guardaMaterial/matricula", payload);
            setModalMessage("Usuário cadastrado com sucesso!");
            setShowModal(true);
            setForm({ matricula: '', usuarioDatasul: '', tipo: 1, situacao: 1, nome: '', senha: '', confirmarSenha: '' });
            setSenhaMatch(null);
        } catch (error) {
            setModalMessage("Erro ao cadastrar o usuário.");
            setShowModal(true);
            console.error("Erro ao cadastrar usuário:", error);
        }
    }

    return(
        <ComProtecao>
        <html>
            <body>
                <div className={style.loginColetorPage}>
                    <div className={style.box}>
                        <form onSubmit={cadastrar}>
                            <label>MATRÍCULA:</label>
                            <input
                                ref={refMatricula}
                                type='text'
                                name='matricula'
                                value={form.matricula}
                                onChange={handleChange}
                                required
                            />
                            <label>USUÁRIO DATASUL:</label>
                            <input
                                type='text'
                                name='usuarioDatasul'
                                value={form.usuarioDatasul}
                                onChange={handleChange}
                                required
                            />
                            <label>NOME:</label>
                            <input
                                type='text'
                                name='nome'
                                value={form.nome}
                                onChange={handleChange}
                                required
                            />
                            <label>SITUAÇÃO:</label>
                            <select name="situacao" value={form.situacao} onChange={handleChange} required>
                                <option value={0}>Inativo</option>
                                <option value={1}>Ativo</option>
                            </select>
                            <label>TIPO:</label>
                            <select name="tipo" value={form.tipo} onChange={handleChange} required>
                                <option value={1}>Funcionário</option>
                                <option value={2}>Gestor</option>
                                <option value={3}>Admin</option>
                            </select>
                            <label>SENHA (6 NÚMEROS):</label>
                            <input
                                type='password'
                                name='senha'
                                value={form.senha}
                                onChange={handleChange}
                                required
                                inputMode='numeric'
                                pattern='\d{6}'
                                title='A senha deve conter exatamente 6 números.'
                            />
                            <label>CONFIRMAR SENHA:</label>
                            <input
                                type='password'
                                name='confirmarSenha'
                                value={form.confirmarSenha}
                                onChange={handleChange}
                                required
                                inputMode='numeric'
                                pattern='\d{6}'
                                title='Confirme a senha com exatamente 6 números.'
                            />
                            {senhaMatch !== null && (
                                <p style={{ color: senhaMatch ? 'green' : 'red', fontWeight: 500 }}>
                                    {senhaMatch ? 'As senhas coincidem.' : 'As senhas não coincidem.'}
                                </p>
                            )}
                            <div className={style.btnCadastrar}>
                                <Botao
                                    size='fullSize'
                                    type='submit'
                                    onClick={cadastrar}
                                    disabled={!camposPreenchidos()}
                                >
                                    CADASTRAR
                                </Botao>
                            </div>
                        </form>
                    </div>
                </div>
                {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}
                {showRestricao && (
                    <Modal
                        message="Acesso restrito a administradores. Faça login com uma conta autorizada."
                        onClose={() => {
                        setShowRestricao(false);
                        router.push("/coletor/home");
                        }}
                    />
                )}
            </body>
        </html>
        </ComProtecao>
    );
}
