import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/index.js'

export default function Receipt() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderData = location.state

  useEffect(() => {
    if (!orderData) {
      navigate('/store')
    }
  }, [orderData, navigate])

  if (!orderData) return null

  const { items, amount, address, tokens, paymentMethod, date } = orderData

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-black print:bg-white print:p-0">
      <div className="mx-auto max-w-2xl bg-white p-10 shadow-lg print:shadow-none print:max-w-full print:p-4">
        
        {/* Actions - Hidden when printing */}
        <div className="mb-8 flex justify-between print:hidden">
          <Button onClick={() => navigate('/dashboard')} className="!bg-gray-800 !text-white hover:!bg-gray-700 border-none">
            Go to Dashboard
          </Button>
          <Button onClick={() => window.print()} className="!bg-primary-600 !text-white border-none">
            Print Receipt
          </Button>
        </div>

        {/* Receipt Header */}
        <div className="border-b-2 border-gray-200 pb-6 mb-6 text-center">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-widest">Three13 Fitness</h1>
          <p className="text-gray-500 mt-2">Official Purchase Receipt</p>
        </div>

        {/* Customer & Order Info */}
        <div className="flex justify-between mb-8 text-sm">
          <div>
            <p className="font-bold text-gray-700 mb-1">Billed To:</p>
            <p className="font-semibold text-lg">{address.fullName}</p>
            <p>{address.house}</p>
            <p>{address.city}, {address.state} - {address.pincode}</p>
            <p className="mt-1">Phone: {address.mobile}</p>
          </div>
          <div className="text-right">
            <p><span className="font-bold text-gray-700">Date:</span> {new Date(date).toLocaleString()}</p>
            <p className="mt-1"><span className="font-bold text-gray-700">Payment:</span> {paymentMethod === 'cash' ? 'Cash On Delivery' : 'Online Payment'}</p>
            <p className="mt-1"><span className="font-bold text-gray-700">Tokens Issued:</span> {tokens?.length || 0}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-left mb-8">
          <thead>
            <tr className="border-b-2 border-gray-800 text-gray-800">
              <th className="py-2">Item Description</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-3">{item.name}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">₹{item.price.toFixed(2)}</td>
                <td className="py-3 text-right font-semibold">₹{item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="text-right w-1/2">
            <p className="text-xl font-bold text-gray-900 border-t-2 border-gray-800 pt-2">
              Total Amount: ₹{amount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Tokens Section */}
        {tokens && tokens.length > 0 && (
          <div className="mb-8 border-t border-gray-200 pt-6 mt-6">
            <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Generated Verification Tokens</h3>
            <div className="grid grid-cols-2 gap-4">
              {tokens.map((t, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-sm text-center font-bold text-gray-800">
                  {t}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">Please keep these tokens safe for verification.</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-12 pt-8 border-t border-gray-200">
          <p>Thank you for shopping with Three13 Fitness!</p>
          <p>For any queries, please visit our website or contact support.</p>
        </div>

      </div>
    </div>
  )
}
