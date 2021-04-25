import fs from "fs";
import XlsxTemplate from "xlsx-template";
import { RatingEnum } from "./models/investment.model";

export interface ExcelData {
  content: string;
  contentType: string;
  fileName: string;
}

export enum Months {
  six = 6,
  twelve = 12,
  eighteen = 18,
  twentyfour = 24,
  thirtysix = 36
}

export type ExcelEntryData = InvestmentsEntryData & {investedAmount: number}

export type InvestmentsEntryData = {
  [key in RatingEnum]: {
    [key in Months]: number;
  }
}

export type ExcelFormat = string | Buffer | Uint8Array | Blob | ArrayBuffer;

export abstract class ExcelService {
  public abstract create(): Promise<void>;

  protected async createExcelFormat(template: string, data: ExcelEntryData) {
    return new Promise<void>((resolve, reject) => {
      fs.readFile("./templates/" + template, (error, binaryTemplate) => {
        if (error) {
          reject(error);

          return;
        }
        const excelTemplate = new XlsxTemplate(binaryTemplate);
        excelTemplate.substitute(1, data);
          const base64TemplateWithData: ExcelFormat = excelTemplate.generate({
          type: "uint8array",
        });


        fs.writeFile("./Fagura.xlsx", base64TemplateWithData as any, () => {
          resolve();
        });
      });
    });
  }
}
