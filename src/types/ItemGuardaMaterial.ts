
export interface IItemGuardaMaterial {
    id: string,
    item: string,
    descricao: string,
    quantidade: number,
    notaFiscal: string,
    status: string,
    responsavel: string,
    matriculaResponsavel?: string,
    datahora: Date,
    observacao: string,
    dataHoraAtualizacao: string
    dataHoraCarga: string
}


export interface IItemRecebimento {
    id: string,
    dataHoraAtualizacao: string,
    dataHoraCarga: string,
    natOperacao: string,
    idAcaoEnviar: number,
    userTransacao: string,
    sequencia: number,
    serieDocto: string,
    itCodigo: string,
    unidade: string,
    nroDocto: string,
    dataTransacao: string,
    DescAcaoEnviar: string,
    horaTransacao: string,
    descItem: string,
    quantidade: number,
    codEmitente: number,
    status: string,
    responsavel: string,
    ativo: boolean,
    observacao: string
}