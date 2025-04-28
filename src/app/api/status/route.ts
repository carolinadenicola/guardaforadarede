import { Filter } from "@/types/Filter";
import { APIGuarda } from "@/utils/api/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string }} ) {
    process.setMaxListeners(0);
    var retorno: NextResponse = new NextResponse('', {
        status: 400
    })  

    await APIGuarda.get(`guardaMaterial/listaStatus`)
    .then(res => {

        let status: Filter[] = new Array<Filter>
        
        if(res.data.listaStatus){
            res.data.listaStatus.map((i: string) => {
                status.push({label: i,value:i})
            })
        }
        retorno = NextResponse.json(status, { status: 200 })
    })
    .catch(err => {
        console.log(err);
        retorno = NextResponse.json('', { status: 500 })
    })

    return retorno
  
}