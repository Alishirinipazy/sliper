// سبد فروش حضوری: روی همین دستگاه نگه‌داری می‌شه تا با رفرش صفحه از بین نره
export interface PosLine {
  key: string
  product_id: number
  color_id: number | null
  size_id: number | null
  name: string
  image: string
  color: string | null
  size: string | null
  unit: number
  max: number
  quantity: number
}

const STORAGE_KEY = 'pos-cart-v1'

export function usePos() {
  const lines = useState<PosLine[]>('pos-lines', () => [])
  const discount = useState<number>('pos-discount', () => 0)
  const phone = useState<string>('pos-phone', () => '')
  const loaded = useState<boolean>('pos-loaded', () => false)

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({lines: lines.value, discount: discount.value, phone: phone.value}))
    } catch { /* حالت خصوصی/بلاک‌شده: فقط ذخیره نمی‌شه */ }
  }

  function restore() {
    if (loaded.value) return
    loaded.value = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      lines.value = Array.isArray(data.lines) ? data.lines : []
      discount.value = Number(data.discount) || 0
      phone.value = data.phone || ''
    } catch { /* داده خراب؛ نادیده */ }
  }

  watch([lines, discount, phone], persist, {deep: true})

  const itemCount = computed(() => lines.value.reduce((n, l) => n + l.quantity, 0))
  const subtotal = computed(() => lines.value.reduce((n, l) => n + l.unit * l.quantity, 0))
  const safeDiscount = computed(() => Math.min(Math.max(0, discount.value || 0), subtotal.value))
  const total = computed(() => subtotal.value - safeDiscount.value)

  function add(line: Omit<PosLine, 'key'>) {
    const key = `${line.product_id}-${line.color_id ?? 0}-${line.size_id ?? 0}`
    const existing = lines.value.find(l => l.key === key)
    if (existing) {
      existing.quantity = Math.min(existing.max, existing.quantity + line.quantity)
      existing.unit = line.unit
      existing.max = line.max
    } else {
      lines.value.push({...line, key, quantity: Math.min(line.max, line.quantity)})
    }
  }

  function setQty(key: string, qty: number) {
    const line = lines.value.find(l => l.key === key)
    if (!line) return
    if (qty <= 0) remove(key)
    else line.quantity = Math.min(line.max, qty)
  }

  function remove(key: string) {
    lines.value = lines.value.filter(l => l.key !== key)
  }

  function clear() {
    lines.value = []
    discount.value = 0
    phone.value = ''
  }

  return {lines, discount, phone, itemCount, subtotal, safeDiscount, total, add, setQty, remove, clear, restore}
}
