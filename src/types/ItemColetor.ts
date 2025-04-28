export interface ItemColetor {
    quantidade?: number;
    localizacao?: string;
    item?: string;
    codigoItem: string;
    codigoInteiro: string;
    qtdeAtual: number; //É uma propriedade opcional, não vai vir da api mas é preciso declarar para poder manipular no front-end através da interface
    qtdeFinal: number;
    status: number;
    local?: string; // não é pra ser opcional, precisa trocar depois
  }
  