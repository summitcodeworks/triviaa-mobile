export interface Transaction {
    id: string
    type: "debit" | "credit"
    amount: number
    description: string
    date: string
    category: string
}

