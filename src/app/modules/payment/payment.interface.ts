export interface TPaymentIntent {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}

export interface TConfirmPayment {
  paymentIntentId: string
  orderId: string
}
