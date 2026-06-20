export interface CartItem {
  slug: string;
  name: string;
  brand: string;
  category: string;
  pricePerDay: number;
  quantity: number;
}

const CART_KEY = 'amply_cart';
const LAST_ORDER_KEY = 'amply_last_order';

export function getCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartBadge();
}

export function addToCart(item: Omit<CartItem, 'quantity'>): void {
  const cart = getCart();
  const existing = cart.find(i => i.slug === item.slug);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
}

export function removeFromCart(slug: string): void {
  saveCart(getCart().filter(i => i.slug !== slug));
}

export function updateQty(slug: string, qty: number): void {
  if (qty <= 0) { removeFromCart(slug); return; }
  const cart = getCart();
  const item = cart.find(i => i.slug === slug);
  if (item) { item.quantity = qty; saveCart(cart); }
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

export function getCartCount(): number {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function getCartSubtotalPerDay(): number {
  return getCart().reduce((sum, i) => sum + i.pricePerDay * i.quantity, 0);
}

export function updateCartBadge(): void {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count > 0 ? String(count) : '';
  (badge as HTMLElement).style.display = count > 0 ? 'flex' : 'none';
}

export function saveLastOrder(order: object): void {
  localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
}

export function getLastOrder(): Record<string, unknown> | null {
  try {
    const stored = localStorage.getItem(LAST_ORDER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getDiscountForDays(days: number): number {
  const tiers = [
    { minDays: 7, discountPct: 10 },
    { minDays: 3, discountPct: 5 },
    { minDays: 2, discountPct: 2 },
    { minDays: 1, discountPct: 0 },
  ];
  return tiers.find(t => days >= t.minDays)?.discountPct ?? 0;
}

export function generateOrderRef(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AMPLY-${date}-${rand}`;
}
