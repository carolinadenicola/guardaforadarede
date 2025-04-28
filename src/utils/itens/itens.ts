import { IItemGuardaMaterial, IItemRecebimento } from "@/types/ItemGuardaMaterial"

export function itemRecebimento2GuardaMaterial(recebimento: IItemRecebimento): IItemGuardaMaterial | undefined{
    try {
        let data = recebimento.dataTransacao.split("T")[0]
        let datahora = new Date(`${data} ${recebimento.horaTransacao}`)

        let itemGuardaMaterial: IItemGuardaMaterial = {
            id: recebimento.id,
            item: recebimento.itCodigo,
            descricao: recebimento.descItem,
            quantidade: recebimento.quantidade,
            notaFiscal: recebimento.nroDocto,
            status: recebimento.status,
            responsavel: recebimento.responsavel,
            datahora: datahora,
            observacao: recebimento.observacao,
            dataHoraAtualizacao: recebimento.dataHoraAtualizacao,
            dataHoraCarga: recebimento.dataHoraCarga
        }

        return itemGuardaMaterial
        
    } catch (error) {
        
    }
}