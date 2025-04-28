import { IItemGuardaMaterial } from "@/types/ItemGuardaMaterial"
import { formatDateHourBR } from "@/utils/Date"
import {  useState } from "react"
import ReactSelect from "react-select"
import Button from "./Button"
import { useQuery } from "@tanstack/react-query"
import { APILocal } from "@/utils/api/axios"
import { Controller, useForm } from "react-hook-form"

interface IModalItem{
    item: IItemGuardaMaterial | undefined
    limparItem: () => void
    excluirItem: (item: IItemGuardaMaterial, mensagem: string) => void
    inativarItem: (item: IItemGuardaMaterial) => void
    salvarAlteracao: (item: IItemGuardaMaterial, parametro: string) => void
}

type novoResponsavel = {
    matricula: string,
    nome: string
}

interface form {
    novoStatus: {label: string, value: string},
    novoResponsavel: string,
    novaObservacao: string,
    motivoExclusao: string
}

export default function ModalItemGuarda({ item, limparItem, excluirItem, inativarItem, salvarAlteracao}: IModalItem) {

const [action, setAction] = useState<string>()

const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm<form>();

const status = useQuery({
    queryFn: async () => await getStatus(),
    queryKey: ['status'], 
});


const aplicar = handleSubmit((data) => {
    if(item){
        if(item.observacao === "null"){
            item.observacao = "";
        }
        if(action === 'responsavel' && data.novoResponsavel && data.novoStatus.value !== ''){            
            item.matriculaResponsavel = data.novoResponsavel
            item.status = data.novoStatus.value;
            item.observacao = data.novaObservacao;
            salvarAlteracao(item, 'responsavel');
            fecharModal();
        }

        if(action === 'excluir' && data.motivoExclusao){
            excluirItem(item, data.motivoExclusao);
            fecharModal();
        } 
        
        if(action === 'inativa'){
            inativarItem(item);
            fecharModal();
        }
    }
})

function fecharModal(){
    setAction(undefined);
    limparItem();
    reset();
}

async function getStatus(){
    let statusParam = [
        { value: '', label: '' }
    ]

    await APILocal.get('api/status')
    .then(res => {
        statusParam = res.data;
    })
    .catch(err => {
        console.log(err);
    })
    return statusParam;
}

if (item !== undefined)
return (
    <div id="default-modal" tabIndex={-1} className={`${item !== undefined ? '' : 'hidden'} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
        <div className="relative p-4 w-full max-w-2xl max-h-full">
            <form  onSubmit={aplicar}>
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-300 text-gray-900">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <span>
                            <label className="">{`Nota - Item`}</label>
                            <h3 className="text-xl font-semibold">
                                {`${item?.notaFiscal} - ${item?.descricao} [${item?.status}]`}
                            </h3>
                        </span>
                        <button type="button" onClick={() => fecharModal()} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-800">
                            {`Item: ${item?.item} - ${item?.descricao}`}
                            <br/>
                            {`Quantidade: ${item.quantidade}`}
                            <br/>
                            {`Responsável:`} {`${item.responsavel}`}
                            <br/>
                            {`Data/Hora: ${formatDateHourBR(item?.datahora)}`}
                            <br/>
                            {`Status: ${item.status}`}
                            <br/>
                            {`Observação: ${item.observacao === null ? "" : item.observacao}`}
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                            
                            {/* Tranformando mudança de status e alteração de responsável em apenas um botão */}
                            {/* <Button chave="status" action={action} setAction={setAction}> 
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"  fill="currentColor">
                                    <path d="M160-160q-33 0-56.5-23.5T80-240v-120h80v120h640v-480H160v120H80v-120q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm300-140-56-58 83-82H80v-80h407l-83-82 56-58 180 180-180 180Z"/>
                                </svg>
                                Novo Status
                            </Button> */}

                            <Button chave="responsavel" action={action} setAction={setAction}> 
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                    <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                                </svg>
                                Novo Status
                            </Button>

                            {/* Remoção dos botões Excluir e Inativar */}
                            {/* <Button chave="inativa" action={action} setAction={setAction}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"  className="text-green-500 dark:text-green-500">
                                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                                </svg>
                                Inativar
                            </Button>
                            <Button chave="excluir" action={action} setAction={setAction}> 
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" className="text-red-500 dark:text-red-500">
                                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                                </svg>
                                Excluir 
                            </Button> */}
                        </div>
                        
                        {/* Remoção dos botões Excluir e Inativar */}
                        {/* <div  className={`${action === 'excluir' ? '' : 'hidden'} flex flex-col `}>
                            <label className=" w-full">Motivo da exclusão:</label>
                            <textarea 
                                required={action === 'excluir'} 
                                className="w-full  dark:border-gray-300 rounded-lg focus:outline-none dark:text-gray-800" {...register('motivoExclusao')}/>
                            {errors.motivoExclusao && <p>O motivo da exclusão é obrigatório para poder excluir.</p>}
                        </div> */}

                        {/* Tranformando mudança de status e alteração de responsável em apenas um botão */}
                        {/* <div  className={`${action === 'status' ? '' : 'hidden'} flex align-middle items-center `}>
                            <label htmlFor="status" className="mr-2">Status:</label>
                            { status.data && Array.isArray(status.data)  && 
                                    <Controller
                                        control={control}
                                        name="novoStatus"
                                        render={({ field }) => (
                                        <ReactSelect
                                            id="status"
                                            className="w-full" 
                                            placeholder="Selecione o status"
                                            options={status.data}
                                            {...field}
                                            required={action === 'status'}
                                        />
                                        )}
                                />
                            }                            

                        </div> */}

                        <div  className={`${action === 'responsavel' ? '' : 'hidden'} align-middle items-center `}>
                            <div className="flex mt-2 align-middle items-center">
                                <label htmlFor="matricula" className="mr-1">Responsável:</label>
                                <input id="matricula" className="w-full outline-none rounded-sm py-2" placeholder="Digite a matrícula"
                                    autoComplete="false" required={action === 'responsavel'} 
                                    {...register('novoResponsavel')}
                                    //value={novoResponsavel?.matricula} //onChange={(e) => setNovoResponsavel({matricula: e.target.value, nome:''})}
                                />
                                <label htmlFor="status" className="mr-2">Status:</label>
                                { status.data && Array.isArray(status.data)  && 
                                        <Controller
                                            control={control}
                                            name="novoStatus"
                                            render={({ field }) => (
                                            <ReactSelect
                                                id="status"
                                                className="w-full" 
                                                placeholder="Selecione o status"
                                                options={status.data}
                                                {...field}
                                                required={action === 'responsavel'}
                                            />
                                            )}
                                    />
                                }  
                                {errors.novoResponsavel && <p>A matrícula é obrigatória para alterar o responsável.</p>}
                            </div>
                            <div className="flex mt-2 align-middle items-center">
                            <label htmlFor="observacao" className="mr-1">Observação:</label>
                                <input id="observacao" className="w-full outline-none rounded-sm py-2" placeholder="Insira sua observação"
                                    autoComplete="false" required={action === 'responsavel'} 
                                    {...register('novaObservacao')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 dark:text-gray-500">
                        <button 
                            type="submit" 
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                            text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Aplicar
                        </button>
                        <button onClick={() => fecharModal()} 
                            type="button" 
                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 
                            hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 
                            dark:hover:text-white dark:hover:bg-gray-700">
                                Cancelar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}
