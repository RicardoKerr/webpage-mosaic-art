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
      agendamentos: {
        Row: {
          assunto: string
          created_at: string | null
          data: string
          email: string
          horario: string
          id: string
          nome: string
          outro_assunto: string | null
          status: string
          telefone: string
          updated_at: string | null
        }
        Insert: {
          assunto: string
          created_at?: string | null
          data: string
          email: string
          horario: string
          id?: string
          nome: string
          outro_assunto?: string | null
          status?: string
          telefone: string
          updated_at?: string | null
        }
        Update: {
          assunto?: string
          created_at?: string | null
          data?: string
          email?: string
          horario?: string
          id?: string
          nome?: string
          outro_assunto?: string | null
          status?: string
          telefone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      aralogo_auth: {
        Row: {
          created_at: string
          email: string
          id: string
          is_admin: boolean
          senha: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_admin?: boolean
          senha: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_admin?: boolean
          senha?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      aralogo_changes: {
        Row: {
          changes: Json
          created_at: string
          id: string
          stone_id: number
          user_email: string | null
        }
        Insert: {
          changes: Json
          created_at?: string
          id?: string
          stone_id: number
          user_email?: string | null
        }
        Update: {
          changes?: Json
          created_at?: string
          id?: string
          stone_id?: number
          user_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_aralogo_simples"
            columns: ["stone_id"]
            isOneToOne: false
            referencedRelation: "aralogo_simples"
            referencedColumns: ["id"]
          },
        ]
      }
      aralogo_simples: {
        Row: {
          "Acabamentos Disponíveis": string | null
          "Caminho da Imagem": string | null
          Características: string | null
          Categoria: string | null
          "Cor Base": string | null
          "Disponível em": string | null
          Enable_On_Off: boolean
          id: number
          Imagem_Name_Site: string | null
          Nome: string | null
          "Tipo de Rocha": string | null
        }
        Insert: {
          "Acabamentos Disponíveis"?: string | null
          "Caminho da Imagem"?: string | null
          Características?: string | null
          Categoria?: string | null
          "Cor Base"?: string | null
          "Disponível em"?: string | null
          Enable_On_Off?: boolean
          id?: number
          Imagem_Name_Site?: string | null
          Nome?: string | null
          "Tipo de Rocha"?: string | null
        }
        Update: {
          "Acabamentos Disponíveis"?: string | null
          "Caminho da Imagem"?: string | null
          Características?: string | null
          Categoria?: string | null
          "Cor Base"?: string | null
          "Disponível em"?: string | null
          Enable_On_Off?: boolean
          id?: number
          Imagem_Name_Site?: string | null
          Nome?: string | null
          "Tipo de Rocha"?: string | null
        }
        Relationships: []
      }
      catalogo_simples: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      material_applications: {
        Row: {
          application_name: string
          created_at: string
          id: string
          material_id: string | null
        }
        Insert: {
          application_name: string
          created_at?: string
          id?: string
          material_id?: string | null
        }
        Update: {
          application_name?: string
          created_at?: string
          id?: string
          material_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_applications_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      material_finishes: {
        Row: {
          created_at: string
          finish_name: string
          id: string
          material_id: string | null
        }
        Insert: {
          created_at?: string
          finish_name: string
          id?: string
          material_id?: string | null
        }
        Update: {
          created_at?: string
          finish_name?: string
          id?: string
          material_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_finishes_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      material_images: {
        Row: {
          alt_text: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_primary: boolean
          material_id: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_primary?: boolean
          material_id?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_primary?: boolean
          material_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_images_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      material_technical_specs: {
        Row: {
          created_at: string
          id: string
          material_id: string | null
          spec_name: string
          spec_value: string
          unit: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          material_id?: string | null
          spec_name: string
          spec_value: string
          unit?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          material_id?: string | null
          spec_name?: string
          spec_value?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_technical_specs_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          base_color: string
          category: string
          commercial_name: string
          created_at: string
          description: string | null
          direct_link: string | null
          id: string
          is_active: boolean
          main_image_url: string | null
          origin: string
          rock_type: string
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          base_color: string
          category: string
          commercial_name: string
          created_at?: string
          description?: string | null
          direct_link?: string | null
          id?: string
          is_active?: boolean
          main_image_url?: string | null
          origin: string
          rock_type: string
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          base_color?: string
          category?: string
          commercial_name?: string
          created_at?: string
          description?: string | null
          direct_link?: string | null
          id?: string
          is_active?: boolean
          main_image_url?: string | null
          origin?: string
          rock_type?: string
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "materials_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      Maturidade_Cliente: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          source: string | null
          subscribed_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          source?: string | null
          subscribed_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          source?: string | null
          subscribed_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      "primos-empresa": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      scraped_data: {
        Row: {
          config_id: string | null
          created_at: string
          data: Json
          id: string
          scraping_type: string
          status: string
          url: string
          user_id: string
        }
        Insert: {
          config_id?: string | null
          created_at?: string
          data: Json
          id?: string
          scraping_type: string
          status?: string
          url: string
          user_id: string
        }
        Update: {
          config_id?: string | null
          created_at?: string
          data?: Json
          id?: string
          scraping_type?: string
          status?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scraped_data_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "scraping_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      scraping_configs: {
        Row: {
          created_at: string
          id: string
          name: string
          needs_auth: boolean
          scraping_type: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          needs_auth?: boolean
          scraping_type: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          needs_auth?: boolean
          scraping_type?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      user_approvals: {
        Row: {
          email: string
          id: string
          processed_at: string | null
          processed_by: string | null
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          email: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          email?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          status?: string
          user_id?: string
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
