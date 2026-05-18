import axios from 'axios'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MPESA_BASE_URL = process.env.MPESA_ENVIRONMENT === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke'

class MpesaService {
  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64')

    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    )

    return response.data.access_token
  }

  private generateTimestamp(): string {
    const date = new Date()
    return date.toISOString().replace(/[^0-9]/g, '').slice(0, -3)
  }

  private generatePassword(timestamp: string): string {
    const shortcode = process.env.MPESA_SHORTCODE!
    const passkey = process.env.MPESA_PASSKEY!
    return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
  }

  async initiateSTKPush(
    phoneNumber: string,
    amount: number,
    accountReference: string,
    transactionDesc: string
  ) {
    try {
      const accessToken = await this.getAccessToken()
      const timestamp = this.generateTimestamp()
      const password = this.generatePassword(timestamp)

      // Format phone number (remove leading 0 or + and ensure 254 prefix)
      let formattedPhone = phoneNumber.replace(/\D/g, '')
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.slice(1)
      } else if (formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.slice(1)
      } else if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone
      }

      const payload = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.CLIENT_URL}/api/payments/callback`,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      }

      const response = await axios.post(
        `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        success: true,
        checkoutRequestID: response.data.CheckoutRequestID,
        merchantRequestID: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
      }
    } catch (error: any) {
      console.error('M-Pesa STK Push Error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.errorMessage || 'Failed to initiate M-Pesa payment')
    }
  }

  async querySTKStatus(checkoutRequestID: string) {
    try {
      const accessToken = await this.getAccessToken()
      const timestamp = this.generateTimestamp()
      const password = this.generatePassword(timestamp)

      const payload = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      }

      const response = await axios.post(
        `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data
    } catch (error: any) {
      console.error('M-Pesa Query Error:', error.response?.data || error.message)
      throw error
    }
  }

  async processCallback(callbackData: any) {
    const {
      Body: { stkCallback },
    } = callbackData

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback

    // Find booking by merchant request ID
    const booking = await prisma.booking.findFirst({
      where: { mpesaReceipt: MerchantRequestID },
    })

    if (!booking) {
      console.error('Booking not found for callback:', MerchantRequestID)
      return
    }

    if (ResultCode === 0) {
      // Payment successful
      const receiptNumber = CallbackMetadata?.Item?.find(
        (item: any) => item.Name === 'MpesaReceiptNumber'
      )?.Value

      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: 'completed',
          status: 'confirmed',
          mpesaReceipt: receiptNumber || MerchantRequestID,
        },
      })
    } else {
      // Payment failed
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: 'failed',
          status: 'cancelled',
        },
      })
    }

    return { ResultCode, ResultDesc }
  }
}

export const mpesaService = new MpesaService()
