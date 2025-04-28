
import { IItemGuardaMaterial, IItemRecebimento } from "@/types/ItemGuardaMaterial";
import { APIGuarda } from "@/utils/api/axios";
import { itemRecebimento2GuardaMaterial } from "@/utils/itens/itens";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string }} ) {
    process.setMaxListeners(0);
    var retorno: NextResponse = new NextResponse('', {
        status: 400
    })  

    await APIGuarda.get('guardaMaterial/listaRecebimento')
    .then(res => {
        let listaRecebimento: IItemRecebimento[] = res.data;
        let listaGuardaMaterial: IItemGuardaMaterial[] = new Array<IItemGuardaMaterial>;

        // console.log(listaRecebimento)

        for(let i=0; i<listaRecebimento.length; i++){         
            let itemGuardaMaterial = itemRecebimento2GuardaMaterial(listaRecebimento[i]);
            if(itemGuardaMaterial){
                listaGuardaMaterial.push(itemGuardaMaterial);
            }
        }
        retorno = NextResponse.json(listaGuardaMaterial, { status: 200 })
    })
    .catch(err => {
        console.log(err);
        retorno = NextResponse.json('', { status: 500 })
    })

    return retorno
  
}