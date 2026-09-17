import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

function PaymentModal({ subOrder, onClose, onConfirm }) {
  const [method, setMethod] = useState(null)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [processing, setProcessing] = useState(false)

  const qrValue = `stroy-shop-payment:${subOrder.id}:${subOrder.amount}`

  // убираем всё, кроме цифр, разбиваем по 4 цифры и склеиваем через пробел
  const formatCardNumber = (value) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 16)
    return digitsOnly.replace(/(.{4})/g, '$1 ').trim()
  }

  // автоматически вставляем "/" после первых двух цифр (месяц)
  const formatExpiry = (value) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 4)
    if (digitsOnly.length <= 2) return digitsOnly
    return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
  }

  const formatCvv = (value) => {
    return value.replace(/\D/g, '').slice(0, 3)
  }

  // проверяем, что все поля карты заполнены ПОЛНОСТЬЮ и корректно
  const isCardValid =
    cardNumber.replace(/\s/g, '').length === 16 &&
    /^\d{2}\/\d{2}$/.test(cardExpiry) &&
    cardCvv.length === 3

  const handlePay = async () => {
    setProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    await onConfirm(method)
    setProcessing(false)
  }

  return (
    <div className="fixed inset-0 bg-charcoal/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-sm max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl font-semibold text-charcoal">
            Оплата заказа #{subOrder.id}
          </h2>
          <button
            onClick={onClose}
            className="text-charcoal/40 hover:text-charcoal text-xl leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-charcoal/60 mb-6">К оплате: {subOrder.amount} сом</p>

        {!method && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setMethod('card')}
              className="border border-charcoal/20 rounded-sm py-3 hover:border-steel transition-colors"
            >
              Оплатить картой
            </button>
            <button
              onClick={() => setMethod('qr')}
              className="border border-charcoal/20 rounded-sm py-3 hover:border-steel transition-colors"
            >
              Оплатить через QR
            </button>
          </div>
        )}

        {method === 'card' && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              className="border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
            />
            <div className="flex gap-3">
              <input
                type="text"
                inputMode="numeric"
                placeholder="ММ/ГГ"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                className="border border-charcoal/20 rounded-sm px-3 py-2 flex-1 focus:outline-none focus:border-steel"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="CVV"
                value={cardCvv}
                onChange={(e) => setCardCvv(formatCvv(e.target.value))}
                maxLength={3}
                className="border border-charcoal/20 rounded-sm px-3 py-2 flex-1 focus:outline-none focus:border-steel"
              />
            </div>

            <button
              onClick={handlePay}
              disabled={processing || !isCardValid}
              className="bg-amber text-charcoal font-medium py-3 rounded-sm hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              {processing ? 'Обработка...' : `Оплатить ${subOrder.amount} сом`}
            </button>
            <button
              onClick={() => setMethod(null)}
              className="text-charcoal/50 text-sm hover:underline"
            >
              ← Выбрать другой способ
            </button>
          </div>
        )}

        {method === 'qr' && (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 border border-charcoal/10 rounded-sm">
              <QRCodeSVG value={qrValue} size={180} />
            </div>
            <p className="text-charcoal/60 text-sm text-center">
              Отсканируйте QR-код в приложении вашего банка
            </p>

            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full bg-amber text-charcoal font-medium py-3 rounded-sm hover:brightness-110 transition disabled:opacity-50"
            >
              {processing ? 'Ожидание оплаты...' : 'Я оплатил(а)'}
            </button>
            <button
              onClick={() => setMethod(null)}
              className="text-charcoal/50 text-sm hover:underline"
            >
              ← Выбрать другой способ
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentModal