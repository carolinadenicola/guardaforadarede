import { APIGuarda } from "@/utils/api/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string }} ) {
    process.setMaxListeners(0);
    var retorno: NextResponse = new NextResponse('', {
        status: 400
    })  

    await APIGuarda.get(`guardaMaterial/listaRecebimento/${params.id}`)
    .then(res => {
        
        retorno = NextResponse.json('', { status: 200 })
    })
    .catch(err => {
        console.log(err);
        retorno = NextResponse.json('', { status: 500 })
    })

    return retorno
  
}