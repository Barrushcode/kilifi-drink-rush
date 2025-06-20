export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      allthealcoholicproducts: {
        Row: {
          "Charge tax": string | null
          "Compare-at price": string | null
          "Compare-at price / International": string | null
          "Compare-at price / International_1": string | null
          "Compare-at price_1": string | null
          "Continue selling when out of stock": string | null
          "Cost per item": string | null
          Description: string
          "Fulfillment service": string | null
          "Gift card": string | null
          "Google Shopping / AdWords Grouping": string | null
          "Google Shopping / AdWords labels": string | null
          "Google Shopping / Age group": string | null
          "Google Shopping / Condition": string | null
          "Google Shopping / Custom label 0": string | null
          "Google Shopping / Custom label 1": string | null
          "Google Shopping / Custom label 2": string | null
          "Google Shopping / Custom label 3": string | null
          "Google Shopping / Custom label 4": string | null
          "Google Shopping / Custom product": string | null
          "Google Shopping / Gender": string | null
          "Google Shopping / Google product category": string | null
          "Google Shopping / MPN": string | null
          "Image alt text": string | null
          "Image position": string | null
          "Inventory quantity": string | null
          "Inventory tracker": string | null
          Price: number
          "Product image URL": string | null
          "Requires shipping": string | null
          "SEO description": string | null
          "SEO title": string | null
          "Tax code": string | null
          Title: string
          "Variant image URL": string | null
          "Weight unit for display": string | null
          "Weight value (grams)": string | null
        }
        Insert: {
          "Charge tax"?: string | null
          "Compare-at price"?: string | null
          "Compare-at price / International"?: string | null
          "Compare-at price / International_1"?: string | null
          "Compare-at price_1"?: string | null
          "Continue selling when out of stock"?: string | null
          "Cost per item"?: string | null
          Description: string
          "Fulfillment service"?: string | null
          "Gift card"?: string | null
          "Google Shopping / AdWords Grouping"?: string | null
          "Google Shopping / AdWords labels"?: string | null
          "Google Shopping / Age group"?: string | null
          "Google Shopping / Condition"?: string | null
          "Google Shopping / Custom label 0"?: string | null
          "Google Shopping / Custom label 1"?: string | null
          "Google Shopping / Custom label 2"?: string | null
          "Google Shopping / Custom label 3"?: string | null
          "Google Shopping / Custom label 4"?: string | null
          "Google Shopping / Custom product"?: string | null
          "Google Shopping / Gender"?: string | null
          "Google Shopping / Google product category"?: string | null
          "Google Shopping / MPN"?: string | null
          "Image alt text"?: string | null
          "Image position"?: string | null
          "Inventory quantity"?: string | null
          "Inventory tracker"?: string | null
          Price?: number
          "Product image URL"?: string | null
          "Requires shipping"?: string | null
          "SEO description"?: string | null
          "SEO title"?: string | null
          "Tax code"?: string | null
          Title: string
          "Variant image URL"?: string | null
          "Weight unit for display"?: string | null
          "Weight value (grams)"?: string | null
        }
        Update: {
          "Charge tax"?: string | null
          "Compare-at price"?: string | null
          "Compare-at price / International"?: string | null
          "Compare-at price / International_1"?: string | null
          "Compare-at price_1"?: string | null
          "Continue selling when out of stock"?: string | null
          "Cost per item"?: string | null
          Description?: string
          "Fulfillment service"?: string | null
          "Gift card"?: string | null
          "Google Shopping / AdWords Grouping"?: string | null
          "Google Shopping / AdWords labels"?: string | null
          "Google Shopping / Age group"?: string | null
          "Google Shopping / Condition"?: string | null
          "Google Shopping / Custom label 0"?: string | null
          "Google Shopping / Custom label 1"?: string | null
          "Google Shopping / Custom label 2"?: string | null
          "Google Shopping / Custom label 3"?: string | null
          "Google Shopping / Custom label 4"?: string | null
          "Google Shopping / Custom product"?: string | null
          "Google Shopping / Gender"?: string | null
          "Google Shopping / Google product category"?: string | null
          "Google Shopping / MPN"?: string | null
          "Image alt text"?: string | null
          "Image position"?: string | null
          "Inventory quantity"?: string | null
          "Inventory tracker"?: string | null
          Price?: number
          "Product image URL"?: string | null
          "Requires shipping"?: string | null
          "SEO description"?: string | null
          "SEO title"?: string | null
          "Tax code"?: string | null
          Title?: string
          "Variant image URL"?: string | null
          "Weight unit for display"?: string | null
          "Weight value (grams)"?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          building: string | null
          buyer_email: string
          buyer_gender: string | null
          buyer_name: string
          buyer_phone: string | null
          city: string | null
          created_at: string
          delivery_fee: number
          id: string
          instructions: string | null
          items: Json
          order_reference: string
          order_source: string | null
          region: string
          street: string | null
          subtotal: number
          total_amount: number
        }
        Insert: {
          building?: string | null
          buyer_email: string
          buyer_gender?: string | null
          buyer_name: string
          buyer_phone?: string | null
          city?: string | null
          created_at?: string
          delivery_fee: number
          id?: string
          instructions?: string | null
          items: Json
          order_reference: string
          order_source?: string | null
          region: string
          street?: string | null
          subtotal: number
          total_amount: number
        }
        Update: {
          building?: string | null
          buyer_email?: string
          buyer_gender?: string | null
          buyer_name?: string
          buyer_phone?: string | null
          city?: string | null
          created_at?: string
          delivery_fee?: number
          id?: string
          instructions?: string | null
          items?: Json
          order_reference?: string
          order_source?: string | null
          region?: string
          street?: string | null
          subtotal?: number
          total_amount?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
