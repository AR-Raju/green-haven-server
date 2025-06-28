import httpStatus from "http-status";
import Stripe from "stripe";
import config from "../../config";
import AppError from "../../errors/AppError";
import { Order } from "../order/order.model";
import type { TConfirmPayment, TPaymentIntent } from "./payment.interface";

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2025-05-28.basil",
});

const createPaymentIntent = async (paymentData: TPaymentIntent) => {
  const { amount, currency = "usd", metadata = {} } = paymentData;

  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create payment intent"
    );
  }
};

const confirmPayment = async (confirmData: TConfirmPayment) => {
  const { paymentIntentId, orderId } = confirmData;

  if (!paymentIntentId || !orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing required parameters");
  }

  try {
    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update order status in database
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: "PAID",
          orderStatus: "PROCESSING",
        },
        { new: true }
      );

      if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, "Order not found");
      }

      return {
        success: true,
        order,
        paymentStatus: paymentIntent.status,
      };
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Payment not completed. Status: ${paymentIntent.status}`
      );
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to confirm payment"
    );
  }
};

export const PaymentServices = {
  createPaymentIntent,
  confirmPayment,
};
