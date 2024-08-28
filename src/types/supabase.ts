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
      accounts: {
        Row: {
          created_at: string | null
          domain: string | null
          domain_verified: boolean | null
          from_name: string | null
          id: number
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          domain_verified?: boolean | null
          from_name?: string | null
          id?: never
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          domain_verified?: boolean | null
          from_name?: string | null
          id?: never
        }
        Relationships: []
      }
      analytics: {
        Row: {
          clicks: number | null
          created_at: string | null
          email_id: number | null
          id: number
          views: number | null
        }
        Insert: {
          clicks?: number | null
          created_at?: string | null
          email_id?: number | null
          id?: never
          views?: number | null
        }
        Update: {
          clicks?: number | null
          created_at?: string | null
          email_id?: number | null
          id?: never
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          account_id: number | null
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: number
          imported_at: string | null
          last_name: string | null
          phone_number: string | null
          state: string | null
          subscribed_at: string | null
          unsubscribed_at: string | null
          verified_at: string | null
          zip_code: string | null
        }
        Insert: {
          account_id?: number | null
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: never
          imported_at?: string | null
          last_name?: string | null
          phone_number?: string | null
          state?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          verified_at?: string | null
          zip_code?: string | null
        }
        Update: {
          account_id?: number | null
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: never
          imported_at?: string | null
          last_name?: string | null
          phone_number?: string | null
          state?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          verified_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          account_id: number | null
          content: string
          created_at: string | null
          id: number
          sent_at: string | null
          subject: string
        }
        Insert: {
          account_id?: number | null
          content: string
          created_at?: string | null
          id?: never
          sent_at?: string | null
          subject: string
        }
        Update: {
          account_id?: number | null
          content?: string
          created_at?: string | null
          id?: never
          sent_at?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      outbound_emails: {
        Row: {
          contact_id: number | null
          email_id: number | null
          id: number
          sent_at: string | null
        }
        Insert: {
          contact_id?: number | null
          email_id?: number | null
          id?: never
          sent_at?: string | null
        }
        Update: {
          contact_id?: number | null
          email_id?: number | null
          id?: never
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outbound_emails_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outbound_emails_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      user_accounts: {
        Row: {
          account_id: number | null
          id: number
          joined_at: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          account_id?: number | null
          id?: never
          joined_at?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          account_id?: number | null
          id?: never
          joined_at?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          last_login: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          last_login?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          last_login?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

