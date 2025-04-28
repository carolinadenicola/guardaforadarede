import ExecuteQuery from "@/utils/DB/dbConnection";
import { Operador } from "@/types/Operador";
import { IRecordSet } from "mssql";

export async function POST(req: Request) {
    console.log("chegou no arquivo de login")
    process.setMaxListeners(0);  
    let retorno;
    var aplicacao: IRecordSet<any> | undefined;
    const res = await req.json()
    const matricula = res.matricula;
    
    if(res){
    var operador: Operador;
    var buscaOperador = await ExecuteQuery(`select * from operador where ativo = 1 and cracha = ${matricula}`)
    if(buscaOperador && buscaOperador[0]){
      
      operador = await JSON.parse(JSON.stringify(buscaOperador[0]));
        console.log("Operador: "+operador)

      aplicacao = await ExecuteQuery(`select aplicacao from operador_aplicacao where operador = '${matricula}' and padrao = 1`)
      if(aplicacao){
        var redirecionar = JSON.stringify(aplicacao[0]);
        console.log("Dados redirecionar: "+redirecionar)
        let operadorRetorno = {
          operador: JSON.stringify(operador)
        }
      
        retorno = new Response(JSON.stringify(operadorRetorno), {
          status: 200
        })
      }
      
    }else{
      retorno = new Response('Operador não encontrado', {
        status: 500
      })
    }
  }else{
    retorno = new Response('Body não encontrado', {
      status: 500
    })
  }

  return retorno;
}
