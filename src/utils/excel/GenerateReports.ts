// types
import { IItemGuardaMaterial } from "@/types/ItemGuardaMaterial";

// helpers
// import { formatCurrency } from "../helpers/formatCurrency";

// utils
import { SheetFactory } from "./SheetFactory";

class GenerateReports {
  public static async itens(
    itens: IItemGuardaMaterial[],
  ): Promise<Blob> {

    const sheet = new SheetFactory();

    sheet.setColumnSizes([30, 30, 50]);

    // sheet.addTitleRow(["Relatório"]);

    sheet.addSubtitleRow([
        "Item",
        "Descrição",
        "Quantidade",
        "Nota Fiscal",
        "Status",
        "Responsável",
        "Data Hora"
    ]);

    const itensRows = itens.map(({ item,
                                    descricao,
                                    quantidade,
                                    notaFiscal,
                                    status,
                                    responsavel,
                                    datahora }) => [
        item,
        descricao,
        quantidade,
        notaFiscal,
        status,
        responsavel,
        datahora,
    ]);

    sheet.addRows(itensRows);

    const buffer = await sheet.finishSheet();

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

    return new Blob([buffer], { type: fileType });
  }
}

export { GenerateReports };