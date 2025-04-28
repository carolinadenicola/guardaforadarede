import Excel from "exceljs";

// types
import { IItemGuardaMaterial } from "../../types/ItemGuardaMaterial";


class ReportFormatters {
  public static async itens(file: FileList): Promise<IItemGuardaMaterial[]> {
    const itens: IItemGuardaMaterial[] = [];

    const workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet('My Sheet');


    const reader = new FileReader();
    reader.readAsArrayBuffer(file[0]);

    return new Promise((resolve) => {
      reader.onload = () => {
        const buffer = reader.result as Buffer;

        workbook.xlsx.load(buffer).then((workbook) => {
          workbook.eachSheet((sheet) => {
            sheet.eachRow((row, rowIndex) => {
              if (rowIndex > 1) {
                const line = row.values as Array<any>;

                const item = {
                    item: line[1],
                    descricao: line[2],
                    quantidade: Number(line[3]),
                    notaFiscal: line[4],
                    status: line[5],
                    responsavel: line[6],
                    datahora: line[7]
                };

                itens.push(item);
              }
              resolve(itens);
            });
          });
        });
      };
    });
  }
}

export { ReportFormatters };