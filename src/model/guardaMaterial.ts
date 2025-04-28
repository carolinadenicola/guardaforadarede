import { Filter } from "@/types/Filter";
import { IItemGuardaMaterial } from "@/types/ItemGuardaMaterial";



export class GuardaMaterial {

    constructor() {
        this.itens = new Array<IItemGuardaMaterial>
        this.filtroItem = new Array<Filter>
        this.filtroDescricao = new Array<Filter>
    }


    itens: IItemGuardaMaterial[]
    filtroItem: Filter[]
    filtroDescricao: Filter[]

}