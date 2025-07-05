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
      Contacts: {
        Row: {
          id: number
          "Job Description": string | null
          Name: string
          "Phone Number_1": string | null
          "Phone Number_2": string | null
        }
        Insert: {
          id?: number
          "Job Description"?: string | null
          Name: string
          "Phone Number_1"?: string | null
          "Phone Number_2"?: string | null
        }
        Update: {
          id?: number
          "Job Description"?: string | null
          Name?: string
          "Phone Number_1"?: string | null
          "Phone Number_2"?: string | null
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
          customer_name: string | null
          customer_phone: string | null
          delivery_fee: number
          distributor_id: number | null
          id: string
          instructions: string | null
          items: Json
          location: string | null
          order_reference: string
          order_source: string | null
          products: string | null
          region: string
          rider_id: number | null
          status: string | null
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
          customer_name?: string | null
          customer_phone?: string | null
          delivery_fee: number
          distributor_id?: number | null
          id?: string
          instructions?: string | null
          items: Json
          location?: string | null
          order_reference: string
          order_source?: string | null
          products?: string | null
          region: string
          rider_id?: number | null
          status?: string | null
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
          customer_name?: string | null
          customer_phone?: string | null
          delivery_fee?: number
          distributor_id?: number | null
          id?: string
          instructions?: string | null
          items?: Json
          location?: string | null
          order_reference?: string
          order_source?: string | null
          products?: string | null
          region?: string
          rider_id?: number | null
          status?: string | null
          street?: string | null
          subtotal?: number
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "Contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "Contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      "Product Cartegory": {
        Row: {
          Category: string | null
          Description: string | null
          id: number
          Price: number | null
          Title: string
        }
        Insert: {
          Category?: string | null
          Description?: string | null
          id?: number
          Price?: number | null
          Title: string
        }
        Update: {
          Category?: string | null
          Description?: string | null
          id?: number
          Price?: number | null
          Title?: string
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
