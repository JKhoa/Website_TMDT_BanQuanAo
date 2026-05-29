'use server'

import { createClient } from '../../utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addToCartAction(productId: string, quantity: number, size: string, color: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Vui lòng đăng nhập để thêm vào giỏ hàng' }
  }

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('size', size)
    .eq('color', color)
    .single()

  if (existingItem) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
    
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity,
        size,
        color
      })
    
    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/cart')
  return { success: true }
}

export async function removeFromCartAction(cartItemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/cart')
  return { success: true }
}

export async function updateCartItemQuantityAction(cartItemId: string, quantity: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Unauthorized' }

  if (quantity <= 0) {
    return removeFromCartAction(cartItemId)
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/cart')
  return { success: true }
}

export async function clearCartAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/cart')
  return { success: true }
}
