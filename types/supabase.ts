export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          details: string
          price: number
          image: string
          currency: string
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description: string
          details: string
          price: number
          image: string
          currency?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string
          details?: string
          price?: number
          image?: string
          currency?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      product_sizes: {
        Row: {
          id: string
          product_id: string
          size: string
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          size: string
          stock?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          product_id?: string
          size?: string
          stock?: number
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          stripe_session_id: string
          stripe_payment_intent_id: string | null
          customer_email: string
          customer_name: string | null
          shipping_address: Json | null
          total_amount: number
          currency: string
          status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stripe_session_id: string
          stripe_payment_intent_id?: string | null
          customer_email: string
          customer_name?: string | null
          shipping_address?: Json | null
          total_amount: number
          currency?: string
          status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          stripe_session_id?: string
          stripe_payment_intent_id?: string | null
          customer_email?: string
          customer_name?: string | null
          shipping_address?: Json | null
          total_amount?: number
          currency?: string
          status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          size: string | null
          quantity: number
          unit_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          size?: string | null
          quantity?: number
          unit_price: number
          created_at?: string
        }
        Update: {
          order_id?: string
          product_id?: string
          product_name?: string
          size?: string | null
          quantity?: number
          unit_price?: number
        }
      }
      store_settings: {
        Row: {
          id: number
          is_store_open: boolean
          updated_at: string
        }
        Insert: {
          id?: number
          is_store_open?: boolean
          updated_at?: string
        }
        Update: {
          id?: number
          is_store_open?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
    }
  }
}

// Helper types for easier use
export type Product = Database['public']['Tables']['products']['Row']
export type ProductSize = Database['public']['Tables']['product_sizes']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']

// Extended product type with sizes
export interface ProductWithSizes extends Product {
  product_sizes: ProductSize[]
}
