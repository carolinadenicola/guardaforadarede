export const sessaoOperador = {
    save(matricula: string, nome: string, usuarioDatasul: string, tipo: number) {
        console.log("Operador salvo na sessão");
        globalThis?.sessionStorage?.setItem('MATRICULA', String(matricula));
        globalThis?.sessionStorage?.setItem('NOME', String(nome));
        globalThis?.sessionStorage?.setItem('USUARIO_DATASUL', String(usuarioDatasul));
        globalThis?.sessionStorage?.setItem('TIPO', String(tipo));
    },

    getNomeOperador() {
        return globalThis?.sessionStorage?.getItem('NOME');
    },

    getMatriculaOperador() {
        return globalThis?.sessionStorage?.getItem('MATRICULA');
    },

    getUsuarioDatasul() {
        return globalThis?.sessionStorage?.getItem('USUARIO_DATASUL');
    },

    getTipoOperador() {
        return globalThis?.sessionStorage?.getItem('TIPO');
    },

    delete() {
        console.log("Operador retirado da sessão");
        globalThis?.sessionStorage?.removeItem('MATRICULA');
        globalThis?.sessionStorage?.removeItem('NOME');
        globalThis?.sessionStorage?.removeItem('USUARIO_DATASUL');
        globalThis?.sessionStorage?.removeItem('TIPO');
    }
};
