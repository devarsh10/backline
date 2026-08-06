export interface CartItem {
  slug: string;
  name: string;
  brand: string;
  category: string;
  pricePerDay: number;
  totalUnits: number;
  quantity: number;
  image?: string;
}

export function getMaxQuantity(slug: string): number {
  return getCart().find(i => i.slug === slug)?.totalUnits ?? 0;
}

const CART_KEY = 'backline_cart';
const LAST_ORDER_KEY = 'backline_last_order';

export function getCart(): CartItem[] {
  try {
    const stored = sessionStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  sessionStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartBadge();
}

export function addToCart(item: Omit<CartItem, 'quantity'>): void {
  const cart = getCart();
  const existing = cart.find(i => i.slug === item.slug);
  if (existing) {
    existing.totalUnits = item.totalUnits;
    existing.quantity = Math.min(existing.quantity + 1, item.totalUnits);
  } else {
    cart.push({ ...item, quantity: Math.min(1, item.totalUnits) });
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
  if (item) { item.quantity = Math.min(qty, getMaxQuantity(slug)); saveCart(cart); }
}

export function clearCart(): void {
  sessionStorage.removeItem(CART_KEY);
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
  sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
}

export function getLastOrder(): Record<string, unknown> | null {
  try {
    const stored = sessionStorage.getItem(LAST_ORDER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function generateOrderRef(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BLI-${date}-${rand}`;
}
