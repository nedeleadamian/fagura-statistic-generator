export enum RatingEnum {
  Aone = "A1",
  Atwo = "A2",
  Athree = "A3",
  Afour = "A4",
  Afive = "A5",

  Bone = "B1",
  Btwo = "B2",
  Bthree = "B3",
  Bfour = "B4",
  Bfive = "B5",

  Cone = "C1",
  Ctwo = "C2",
  Cthree = "C3",
  Cfour = "C4",
  Cfive = "C5",

  Done = "D1",
  Dtwo = "D2",
  Dthree = "D3",
  Dfour = "D4",
  Dfive = "D5",

  Eone = "E1",
  Etwo = "E2",
  Ethree = "E3",
  Efour = "E4",
  Efive = "E5",
}

export enum StatusEnum {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  OVERDUE_4_TO_30 = "OVERDUE_4_TO_30",
  OVERDUE_31_TO_60 = "OVERDUE_31_TO_60",
  DEFAULT = "DEFAULT",
  FORCED_COLLECTION = "FORCED_COLLECTION",
  FULLY_PAID = "FULLY_PAID",
  PRE_PAID = "PRE_PAID"
}
export interface InvestmentModel {
  gainedInterest: number;
  paid: number;
  id: number;
  publicId: string;
  isAutoInvest: true;
  interestRate: number;
  scoringRating: RatingEnum;
  investedAmount: number;
  loanPeriod: number;
  status: StatusEnum;
  loanPeriodDeFacto: number;
  nextBillingDate: string | Date;
  outstandingAmount: number;
  investSummary: {
    collectedAmount: number;
    waitingPeriodDays: number;
    interestRate: number;
    id: number;
    publicId: string;
    loanPeriod: number;
    loanAmount: number;
    loanScope: string;
    scoring: RatingEnum;
    appStatus: string;
    monthlyPaymentActiveLoans: {
      averageMonthlyIncome: number;
      netAverageMonthlyIncome: number;
      availableMonthlyIncome: number;
      creditUtilization: number;
      monthlyLoanPayments: number;
    };
    loanApplicationDate: string | Date;
    city: string;
    livingPlace: string;
    maritalStatus: string;
    borrowerGender: string;
    borrowerAge: number;
    borrowerWorkPost: string;
    borrowerWorkExperience: number;
    borrowerMonthlyIncome: number;
    debtToIncome: number;
    infoDebitCheckDate: string | Date;
    infoDebitHistory: string;
    activeDebts: number
    passiveDebts: number;
    loansAmount: string;
    infoDebitChecks: number;
    hasActivePenalties: boolean;
    activePenaltiesAmount: number;
    monthlyRate: number;
  };
}
