export const sessaoOperador = {
    save(matricula: string, nome: string){ 
        console.log("Operador salvo na sessão");
        globalThis?.sessionStorage?.setItem('MATRICULA', String(matricula));
        globalThis?.sessionStorage?.setItem('NOME', String(nome)); 
        
    },
    getNomeOperador(){
        return globalThis?.sessionStorage?.getItem('NOME');
    },
    getMatriculaOperador(){        
        return globalThis?.sessionStorage?.getItem('MATRICULA');
    },
    delete(){
        console.log("Operador retirado da sessão");
        globalThis?.sessionStorage?.removeItem('MATRICULA');  
        globalThis?.sessionStorage?.removeItem('NOME');
    }
    
}