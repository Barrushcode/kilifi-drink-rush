export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      "Cocktails page": {
        Row: {
          id: number
          Image: string | null
          Instructions: string | null
          Name: string
          "Recipe (Ingredients)": string | null
        }
        Insert: {
          id?: number
          Image?: string | null
          Instructions?: string | null
          Name: string
          "Recipe (Ingredients)"?: string | null
        }
        Update: {
          id?: number
          Image?: string | null
          Instructions?: string | null
          Name?: string
          "Recipe (Ingredients)"?: string | null
        }
        Relationships: []
      }
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
          buyer_name: string | null
          buyer_phone: string | null
          city: string | null
          customer_name: string | null
          customer_phone: string | null
          delivery_fee: number | null
          id: number
          instructions: string | null
          items: string | null
          location: string | null
          order_reference: string | null
          order_source: string | null
          products: string | null
          region: string | null
          status: string | null
          street: string | null
          subtotal: number | null
          total_amount: number | null
        }
        Insert: {
          building?: string | null
          buyer_email: string
          buyer_gender?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          city?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_fee?: number | null
          id?: number
          instructions?: string | null
          items?: string | null
          location?: string | null
          order_reference?: string | null
          order_source?: string | null
          products?: string | null
          region?: string | null
          status?: string | null
          street?: string | null
          subtotal?: number | null
          total_amount?: number | null
        }
        Update: {
          building?: string | null
          buyer_email?: string
          buyer_gender?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          city?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_fee?: number | null
          id?: number
          instructions?: string | null
          items?: string | null
          location?: string | null
          order_reference?: string | null
          order_source?: string | null
          products?: string | null
          region?: string | null
          status?: string | null
          street?: string | null
          subtotal?: number | null
          total_amount?: number | null
        }
        Relationships: []
      }
      productprice: {
        Row: {
          Category: string | null
          "Cost per item": number | null
          Description: string | null
          Discounted: string | null
          id: number
          Price: number | null
          "Price / International": number | null
          Profit: number | null
          Title: string
        }
        Insert: {
          Category?: string | null
          "Cost per item"?: number | null
          Description?: string | null
          Discounted?: string | null
          id?: number
          Price?: number | null
          "Price / International"?: number | null
          Profit?: number | null
          Title: string
        }
        Update: {
          Category?: string | null
          "Cost per item"?: number | null
          Description?: string | null
          Discounted?: string | null
          id?: number
          Price?: number | null
          "Price / International"?: number | null
          Profit?: number | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
