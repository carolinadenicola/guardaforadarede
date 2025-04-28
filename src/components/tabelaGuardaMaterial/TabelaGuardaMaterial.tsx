import React, { useState } from "react";
import ReactSelect, { MultiValue } from "react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import { Filter } from "@/types/Filter";
import { formatDateHourBR } from "@/utils/Date";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import ModalItemGuarda from "../modalItemGuarda";
import { APILocal } from "@/utils/api/axios";
import { IItemGuardaMaterial } from "@/types/ItemGuardaMaterial";
import { useEffect, useRef } from 'react';
var moment = require('moment');

type PutObject = {
    id: string,
    parametro: string,
    message?: string,
    matriculaResponsavel?: string,
    status?: string,
    observacao?: string
};

export default function TabelaGuardaMaterial() {
    const queryClient = useQueryClient()
    queryClient.invalidateQueries({ queryKey: ['itens'] })

    const itens = useQuery({
        queryFn: async () => await getItens(),
        queryKey: ['itens'],
        refetchInterval: 300000 // 5 minutos
    });

    const putMutation = useMutation({
        mutationFn: (objectDelete: PutObject) => {
            return APILocal.put('api/item', objectDelete)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['itens'] })
        },
    });

    async function getItens() {
        let retorno: IItemGuardaMaterial[] = [];
        try {
            const res = await APILocal.get('api/itens');
            const dataAtual = moment();
            retorno = res.data.map((item: IItemGuardaMaterial) => ({
                ...item,
                datahora: new Date(item.datahora),
                dataHoraAtualizacao: new Date(item.dataHoraAtualizacao)
            }))
            .filter((item: IItemGuardaMaterial) =>{
                const horarioAttStatus = moment(item.dataHoraAtualizacao);
                const horarioLimite = horarioAttStatus.add(2, 'hours');
                const isStatusValido = item.status !== 'Estoque';
                const isDataValida = horarioLimite.isAfter(dataAtual);
                return isStatusValido || isDataValida;
            });
        } catch (err) {
            console.log(err);
        }
        return retorno;
    }

    const [itensSelecionados, setItensSelecionados] = useState<Filter[]>([]);
    const [descricaoSelecionada, setDescricaoSelecionada] = useState<Filter[]>([]);
    const [notaFiscalSelecionada, setNotaFiscalSelecionada] = useState<Filter[]>([]);
    const [dataInicio, setDataInicio] = useState<Date>();
    const [dataFim, setDataFim] = useState<Date>();
    const [itemSelecionado, setItemSelecionado] = useState<IItemGuardaMaterial>();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Ajuste o número de itens por página

    const itensFiltrados = Array.isArray(itens.data) ? itens.data.filter(item => {
        let retorno = false;

        if (itensSelecionados.length > 0 || descricaoSelecionada.length > 0 || notaFiscalSelecionada.length > 0) {
            retorno = itensSelecionados.some(sel => sel.value === item.item) ||
                descricaoSelecionada.some(sel => sel.value === item.descricao) ||
                notaFiscalSelecionada.some(sel => sel.value === item.notaFiscal);
        } else {
            retorno = true;
        }

        if (dataInicio) {
            console.log(moment(item.dataHoraCarga));
            retorno = moment(item.dataHoraCarga) >= moment(dataInicio) && retorno;
        }
        if (dataFim) {
            retorno = moment(item.dataHoraCarga) <= moment(dataFim) && retorno;
        }

        return retorno;
    }) : [];

    const paginatedItems = itensFiltrados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(itensFiltrados.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const rowRef = useRef<(HTMLTableRowElement | null)[]>([]);

    if(rowRef !== null){
        useEffect(() => {            
            paginatedItems.forEach((item, index) => {
                const row = rowRef.current[index];
                if (row && item.status === 'Estoque') {
                    if(row.classList.contains('bg-white')){
                        row.classList.remove('bg-white');
                        row.classList.add('bg-green-300');
                        row.classList.remove('dark:bg-gray-200');
                        row.classList.add('dark:bg-green-300');
                        row.classList.remove('hover:bg-gray-200')
                        row.classList.add('hover:bg-green-500');
                        row.classList.remove('hover:dark:bg-gray-400')
                        row.classList.add('hover:bg-green-500');
                    }
                    if(row.classList.contains('bg-red-300')){
                        row.classList.remove('bg-red-300');
                        row.classList.add('bg-green-300');
                        row.classList.remove('dark:bg-red-200');
                        row.classList.add('dark:bg-green-300');
                        row.classList.remove('hover:bg-red-500')
                        row.classList.add('hover:bg-green-500');
                        row.classList.remove('hover:dark:bg-red-500')
                        row.classList.add('hover:bg-green-500');
                    }

                }                 
                if(row && item.status !== 'Estoque'){
                    var horarioAttStatus = new Date(item.dataHoraCarga);
                    var useMoment = moment(horarioAttStatus);
                    useMoment.add(24, 'hours')
                    var dataAtual = moment();
                    if (useMoment.isSameOrBefore(dataAtual)) {
                        row.classList.remove('bg-white');
                        row.classList.add('bg-red-300');
                        row.classList.remove('dark:bg-gray-200');
                        row.classList.add('dark:bg-red-300');
                        row.classList.remove('hover:bg-gray-200')
                        row.classList.add('hover:bg-red-500');
                        row.classList.remove('hover:dark:bg-gray-400')
                        row.classList.add('hover:bg-red-500');
                    }
                }            
            });
        
        }, [paginatedItems]);
    }

    const headersCSV = [
        { label: "Item", key: "item" },
        { label: "Descrição", key: "descricao" },
        { label: "Quantidade", key: "quantidade" },
        { label: "Nota Fiscal", key: "notaFiscal" },
        { label: "Status", key: "status" },
        { label: "Responsável", key: "responsavel" },
        { label: "Data de Entrada", key: "dataHoraCarga" },
        { label: "Última Atualização", key: "dataHoraAtualizacao" },
        { label: "Observação", key: "observacao" }
    ];

    const onSelectItem = (values: MultiValue<Filter>, tipo: string) => {
        if (tipo === 'item') setItensSelecionados(values as Filter[]);
        if (tipo === 'descricao') setDescricaoSelecionada(values as Filter[]);
        if (tipo === 'notaFiscal') setNotaFiscalSelecionada(values as Filter[]);
    };

    function onChangeInitialDate(date: Dayjs, dateString: string | string[]) {
        setDataInicio(date ? dayjs(date).toDate() : undefined);
    }

    function onChangeEndDate(date: Dayjs, dateString: string | string[]) {
        setDataFim(date ? dayjs(date).toDate() : undefined);
    }

    function limparItem() {
        setItemSelecionado(undefined);
    }

    function excluirItem(item: IItemGuardaMaterial, mensagem: string) {
        putMutation.mutate({
            id: item.id,
            message: mensagem,
            parametro: 'excluir'
        });
    }

    function inativarItem(item: IItemGuardaMaterial) {
        putMutation.mutate({
            id: item.id,
            parametro: 'inativo'
        });
    }

    function salvarAlteracao(item: IItemGuardaMaterial, parametro: string) {
        putMutation.mutate({
            id: item.id,
            matriculaResponsavel: item.matriculaResponsavel,
            status: item.status,
            observacao: item.observacao,
            parametro: parametro
        });
    }

    function getListaItens(tipoFiltro: string): Filter[] {
        if (tipoFiltro === 'itens') {
            const uniqueItems = new Set();
            return Array.isArray(itens.data)
            ? itens.data
                .filter(item => {
                    const isDuplicate = uniqueItems.has(item.item);
                    uniqueItems.add(item.item);
                    return !isDuplicate;
                })
                .map(item => ({ label: item.item, value: item.item }))
            : [];
        } else
            if (tipoFiltro === 'desc') {
                const uniqueItems = new Set();
                return Array.isArray(itens.data)
                ? itens.data
                    .filter(item => {
                        const isDuplicate = uniqueItems.has(item.descricao);
                        uniqueItems.add(item.descricao);
                        return !isDuplicate;
                    })
                    .map(item => ({ label: item.descricao, value: item.descricao }))
                : [];
            } else
                if (tipoFiltro === 'nf') {
                    const uniqueItems = new Set();
                    return Array.isArray(itens.data)
                    ? itens.data
                        .filter(item => {
                            const isDuplicate = uniqueItems.has(item.notaFiscal);
                            uniqueItems.add(item.notaFiscal);
                            return !isDuplicate;
                        })
                        .map(item => ({ label: item.notaFiscal, value: item.notaFiscal }))
                    : [];
                } else {
                    return [];
                }

    }

    return (
        <section className="relative overflow-x-auto shadow-md sm:rounded-lg p-4 bg-gray-100 h-screen">
            <header className="flex shadow-md rounded-lg">
                <div className="p-2 flex flex-col w-full dark:bg-gray-200 rounded-lg shadow-md dark:text-gray-900">
                    {/* Primeira linha: Filtros */}
                    <div className="flex justify-start mb-2">
                        <div className="flex space-x-4">
                            <div>
                                <label>Item:</label>
                                <ReactSelect isMulti options={getListaItens('itens')} onChange={(e) => onSelectItem(e, 'item')} placeholder='Filtrar item' />
                            </div>
                            <div>
                                <label>Descrição:</label>
                                <ReactSelect isMulti options={getListaItens('desc')} onChange={(e) => onSelectItem(e, 'descricao')} placeholder='Filtrar descrição' />
                            </div>
                            <div>
                                <label>Nota Fiscal:</label>
                                <ReactSelect isMulti options={getListaItens('nf')} onChange={(e) => onSelectItem(e, 'notaFiscal')} placeholder='Filtrar nota fiscal' />
                            </div>
                        </div>
                    </div>
                    {/* Segunda linha: Datas e Botão CSV */}
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-4">
                            <div className="flex flex-col">
                                <label>Data Inicio:</label>
                                <DatePicker onChange={onChangeInitialDate} placeholder="Data inicial" size="large" format={{ format: 'DD/MM/YYYY', type: 'mask' }} />
                            </div>
                            <div className="flex flex-col">
                                <label>Data Fim:</label>
                                <DatePicker onChange={onChangeEndDate} placeholder="Data final" size="large" format={{ format: 'DD/MM/YYYY', type: 'mask' }} />
                            </div>
                        </div>
                        <div className="text-right p-2">
                            {Array.isArray(itensFiltrados) &&
                                <CSVLink data={itensFiltrados} headers={headersCSV} filename="Guarda de Material" separator=";" className="max-w-fit">
                                    <button type="button" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-400 dark:border-gray-500 dark:text-gray-900 dark:hover:bg-gray-500 max-w-fit">
                                        <svg className="w-5 h-6 me-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                            <path className="text-gray-500 dark:text-gray-900" fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm2-2a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm0 3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm-6 4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-6Zm8 1v1h-2v-1h2Zm0 3h-2v1h2v-1Zm-4-3v1H9v-1h2Zm0 3H9v1h2v-1Z" clipRule="evenodd" />
                                        </svg>
                                        Gerar CSV
                                    </button>
                                </CSVLink>
                            }
                        </div>
                    </div>
                </div>
            </header>
            <section className="my-4">
                <table className="w-full text-sm text-left rtl:text-right border-collapse">
                    <thead className="text-md">
                        <tr className="bg-blue-400 dark:bg-blue-900">
                            <th scope="col" className="px-4 py-3 text-center">ITEM</th>
                            <th scope="col" className="px-4 py-3">DESCRIÇÃO</th>
                            <th scope="col" className="px-4 py-3 text-right">QTDE</th>
                            <th scope="col" className="px-4 py-3 text-center">NOTA FISCAL</th>
                            <th scope="col" className="px-4 py-3 text-center">STATUS</th>
                            <th scope="col" className="px-4 py-3">RESPONSÁVEL</th>
                            <th scope="col" className="px-4 py-3 text-center">DATA DE ENTRADA</th>
                            <th scope="col" className="px-4 py-3 text-center ">ÚLTIMA ATUALIZAÇÃO DE STATUS</th>
                            <th scope="col" className="px-4 py-3 text-center">OBSERVAÇÃO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedItems.map((item, index) =>
                            <tr key={item.id} 
                                ref={(el) => rowRef.current[index] = el} 
                                className="bg-white dark:bg-gray-200 border dark:border-gray-400 hover:bg-gray-200 hover:dark:bg-gray-400 dark:text-gray-900" 
                                onClick={() => setItemSelecionado(item)}>
                                <td className="px-4 py-4 text-center">{item.item}</td>
                                <td className="px-4 py-4">{item.descricao}</td>
                                <td className="px-4 py-4 text-right">{item.quantidade}</td>
                                <td className="px-4 py-4 text-center">{item.notaFiscal}</td>
                                <td className="px-4 py-4 text-center">{item.status}</td>
                                <td className="px-4 py-4">{item.responsavel}</td>
                                <td className="px-4 py-4 text-center">{moment(item.dataHoraCarga).format("DD-MM-YYYY HH:mm:ss")}</td>
                                <td className="px-4 py-4 text-center">{moment(item.dataHoraAtualizacao).format("DD-MM-YYYY HH:mm:ss")}</td>
                                <td className="px-4 py-4 text-center">{item.observacao}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Próxima
                    </button>
                </div>
            </section>
            <ModalItemGuarda limparItem={limparItem} item={itemSelecionado} excluirItem={excluirItem} inativarItem={inativarItem} salvarAlteracao={salvarAlteracao} />
        </section>
    );
}
