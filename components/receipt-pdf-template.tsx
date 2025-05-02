import type React from "react"

interface ReceiptItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface ReceiptData {
  receiptNumber: string
  date: string
  customerName: string
  customerEmail: string
  items: ReceiptItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  notes?: string
}

const ReceiptPDFTemplate: React.FC<{ data: ReceiptData }> = ({ data }) => {
  return (
    <div className="bg-white p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Guardget</h1>
          <p className="text-sm text-gray-500">Device Protection Services</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-800">RECEIPT</h2>
          <p className="text-sm text-gray-500">#{data.receiptNumber}</p>
          <p className="text-sm text-gray-500">{data.date}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Customer Information</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-800 font-medium">{data.customerName}</p>
          <p className="text-gray-600">{data.customerEmail}</p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Items</h3>
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="py-2 px-4 text-sm font-medium text-gray-600">Description</th>
              <th className="py-2 px-4 text-sm font-medium text-gray-600 text-center">Qty</th>
              <th className="py-2 px-4 text-sm font-medium text-gray-600 text-right">Unit Price</th>
              <th className="py-2 px-4 text-sm font-medium text-gray-600 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.items.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-sm text-gray-800">{item.description}</td>
                <td className="py-3 px-4 text-sm text-gray-800 text-center">{item.quantity}</td>
                <td className="py-3 px-4 text-sm text-gray-800 text-right">${item.unitPrice.toFixed(2)}</td>
                <td className="py-3 px-4 text-sm text-gray-800 text-right">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mb-6 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-800 font-medium">${data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-800 font-medium">${data.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm font-bold border-t border-gray-200">
            <span className="text-gray-800">Total</span>
            <span className="text-gray-800">${data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Payment Information</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-800">
            <span className="font-medium">Method:</span> {data.paymentMethod}
          </p>
          <p className="text-gray-800">
            <span className="font-medium">Status:</span> <span className="text-green-600 font-medium">Paid</span>
          </p>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Notes</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700">{data.notes}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200">
        <p>Thank you for your business!</p>
        <p>For any questions, please contact support@guardget.com</p>
      </div>
    </div>
  )
}

export default ReceiptPDFTemplate
