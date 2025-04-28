import { APIGuarda } from "@/utils/api/axios";
import { itemRecebimento2GuardaMaterial } from "@/utils/itens/itens";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string }} ) {
    var retorno: NextResponse = new NextResponse('', {
        status: 400
    })  
    const body = await request.json()
    
    if(body.id){
        if(body.matriculaResponsavel && body.status && body.observacao && body.parametro === 'responsavel'){
            await atualizaItem('Responsavel', `${body.id}`, 'matricula', `${body.matriculaResponsavel}`);
            await atualizaItem('Status', `${body.id}`, 'status', `${body.status}`);
            await atualizaItem('Observacao', `${body.id}`, 'observacao', `${body.observacao}`);
        }

        //Comentando pois o inativar e excluir estão desabilitados no sistema
        // if(body.parametro === 'inativo'){
        //     retorno = await inativarItem(`${body.id}`);
        // }
        // if(body.message && body.message !== '' && body.parametro === 'excluir'){
        //     retorno = await deletarItem(body.id, body.message);
        // }       
    }
    
    return retorno;
  
}

async function atualizaItem(parametro: string, id: string, campo: string, novoValor: string) {
    let retorno: NextResponse = new NextResponse('', {
        status: 400
    })  

    const url = `guardaMaterial/atualiza${parametro}?id=${id}&${campo}=${novoValor}`
    await APIGuarda.put(url)
    .then(res => {
        let itemGuardaMaterial = itemRecebimento2GuardaMaterial(res.data);
        if(itemGuardaMaterial){
            retorno = new NextResponse(JSON.stringify(itemGuardaMaterial), {
                status: res.status
            })  
        }
    })
    .catch(err => {
        retorno = new NextResponse(err, {
            status: 500
        })  
    })

    return retorno;
}

async function inativarItem(id: string) {
    let retorno: NextResponse = new NextResponse('', {
        status: 400
    })  

    const url = `guardaMaterial/inativa?id=${id}`
    await APIGuarda.put(url)
    .then(res => {
        retorno = new NextResponse(res.data, {
            status: res.status
        })  
    })
    .catch(err => {
        retorno = new NextResponse(err, {
            status: 500
        })  
    })
    console.log(retorno);
    
    
    return retorno;
}

async function deletarItem(id: string, message: string) {
    let retorno: NextResponse = new NextResponse('', {
        status: 400
    })  
    const url = `guardaMaterial/removeLista?id=${id}&observacao=${message}`
    await APIGuarda.put(url)
    .then(res => {
        retorno = new NextResponse(res.data, {
            status: res.status
        })  
    })
    .catch(err => {
        retorno = new NextResponse(err, {
            status: 500
        })  
    })

    return retorno;
}
