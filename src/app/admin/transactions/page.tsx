'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

// Sample transaction data
const transactions = [
  {
    id: "TRX-001",
    date: "2024-03-21T10:30:00Z",
    agent: "John Smith",
    company: "Smith Roofing",
    type: "subscription",
    amount: 299.99,
    status: "completed",
    paymentMethod: "Credit Card",
    invoiceId: "INV-2024-001",
  },
  {
    id: "TRX-002",
    date: "2024-03-20T15:45:00Z",
    agent: "Sarah Johnson",
    company: "Johnson & Sons Roofing",
    type: "refund",
    amount: -149.99,
    status: "completed",
    paymentMethod: "Credit Card",
    invoiceId: "INV-2024-002",
  },
  {
    id: "TRX-003",
    date: "2024-03-19T09:15:00Z",
    agent: "Mike Rodriguez",
    company: "Rodriguez Roofing Solutions",
    type: "subscription",
    amount: 299.99,
    status: "failed",
    paymentMethod: "Credit Card",
    invoiceId: "INV-2024-003",
  },
  {
    id: "TRX-004",
    date: "2024-03-18T14:20:00Z",
    agent: "Lisa Chen",
    company: "Chen Roofing & Construction",
    type: "zip_code_purchase",
    amount: 99.99,
    status: "completed",
    paymentMethod: "Credit Card",
    invoiceId: "INV-2024-004",
  },
  {
    id: "TRX-005",
    date: "2024-03-17T11:30:00Z",
    agent: "David Wilson",
    company: "Wilson Roofing Services",
    type: "subscription",
    amount: 299.99,
    status: "pending",
    paymentMethod: "Credit Card",
    invoiceId: "INV-2024-005",
  },
];

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage all billing transactions
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{transaction.agent}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.company}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.type === "subscription"
                        ? "default"
                        : transaction.type === "refund"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {transaction.type.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell
                  className={
                    transaction.amount < 0 ? "text-destructive" : "text-green-600"
                  }
                >
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === "completed"
                        ? "default"
                        : transaction.status === "failed"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.paymentMethod}</TableCell>
                <TableCell>
                  <a
                    href={`/admin/invoices/${transaction.invoiceId}`}
                    className="text-primary hover:underline"
                  >
                    {transaction.invoiceId}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 