import {
  ExcelEntryData,
  ExcelService,
  InvestmentsEntryData,
  Months,
} from "./excel.service";
import {
  InvestmentModel,
  RatingEnum,
  StatusEnum,
} from "./models/investment.model";
import axios from "axios";
import { TransactionModel, TransactionType } from "./models/transaction.model";

export class FaguraService extends ExcelService {
  private bearerToken: string | null = null;

  async login(): Promise<void> {
    try {
      const { data } = await axios.post<{ token: string }>(
        "https://api.app.fagura.com/api/auth",
        {
          companyType: "SRL",
          countryCode: "+373",
          email: process.env.EMAIL,
          password: process.env.PASSWORD,
          role: "BORROWER",
        }
      );
      this.bearerToken = data.token;
    } catch (e) {
      console.log(e);
    }
  }

  public async create(): Promise<void> {
    if (!this.bearerToken) {
      await this.login();
    }
    const excelData = await this.getData();

    await this.createExcelFormat(`Fagura-v2.xlsx`, excelData);

    return;
  }

  public async getData(): Promise<ExcelEntryData> {
    return {
      investedAmount: await this.fetchInvestedAmount(),
      ...(await this.fetchInvestments()),
    };
  }

  public formatData(investments: InvestmentModel[]): InvestmentsEntryData {
    const result: any = {};

    for (const key of Object.keys(RatingEnum)) {
      result[key] = [];
    }

    for (const investment of investments) {
      if (
        investment.status !== StatusEnum.FULLY_PAID &&
        investment.status !== StatusEnum.PRE_PAID
      ) {
        result[getKeyByValue(RatingEnum, investment.scoringRating)].push({
          [getKeyByValue(
            Months,
            investment.loanPeriod
          )]: investment.investedAmount,
        });

        console.log(
          `result[${getKeyByValue(
            RatingEnum,
            investment.scoringRating
          )}] ${getKeyByValue(Months, investment.loanPeriod)} = ${
            investment.investedAmount
          }. Period ${investment.loanPeriod}`
        );
      }
    }
    return result;
  }

  public async fetchInvestments(): Promise<InvestmentsEntryData> {
    const investments: InvestmentModel[] = [];
    let page = 0;
    const size = 50;
    let hasNextPage = false;
    do {
      const { data, headers } = await axios.get<InvestmentModel[]>(
        "https://api.app.fagura.com/api/profile/investments",
        {
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
          },
          params: {
            page,
            size,
          },
        }
      );

      investments.push(...data);
      const total = parseInt(headers["x-total-count"], 10);
      page++;
      hasNextPage = size * page < total;
    } while (hasNextPage);

    const filteredInvestments = investments.filter(
      (investment) =>
        investment.status !== StatusEnum.FULLY_PAID &&
        investment.status !== StatusEnum.PRE_PAID
    );
    console.log(
      filteredInvestments.reduce((acc, el) => acc + el.investedAmount, 0)
    );
    console.log(filteredInvestments.length);
    return this.formatData(investments);
  }

  public async fetchInvestedAmount(): Promise<number> {
    const transactions: TransactionModel[] = [];
    let page = 0;
    const size = 50;
    let hasNextPage = false;
    do {
      const { data, headers } = await axios.get<TransactionModel[]>(
        "https://api.app.fagura.com/api/profile/transactions",
        {
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
          },
          params: {
            "filters[type][0]": TransactionType.DEPOSIT,
            page,
            size,
          },
        }
      );

      transactions.push(...data);
      const total = parseInt(headers["x-total-count"], 10);
      page++;
      hasNextPage = size * page < total;
    } while (hasNextPage);

    return transactions.reduce(function (total, el) {
      total += el.amount;

      return total;
    }, 0);
  }
}

function getKeyByValue(object: any, value: any): string {
  return Object.keys(object).find((key) => object[key] === value) as string;
}
