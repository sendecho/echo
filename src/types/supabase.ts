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
      account_id: {
        Row: {
          account_id: string | null
        }
        Insert: {
          account_id?: string | null
        }
        Update: {
          account_id?: string | null
        }
        Relationships: []
      }
      account_users: {
        Row: {
          account_id: string | null
          id: string
          joined_at: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          account_id?: string | null
          id?: string
          joined_at?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          account_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_users_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          domain: string
          domain_verified: boolean | null
          from_name: string | null
          id: string
          name: string
          plan_name: string | null
          postal_code: string | null
          resend_domain_id: string | null
          state: string | null
          street_address: string | null
          stripe_customer_id: string | null
          stripe_product_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          domain: string
          domain_verified?: boolean | null
          from_name?: string | null
          id?: string
          name: string
          plan_name?: string | null
          postal_code?: string | null
          resend_domain_id?: string | null
          state?: string | null
          street_address?: string | null
          stripe_customer_id?: string | null
          stripe_product_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          domain?: string
          domain_verified?: boolean | null
          from_name?: string | null
          id?: string
          name?: string
          plan_name?: string | null
          postal_code?: string | null
          resend_domain_id?: string | null
          state?: string | null
          street_address?: string | null
          stripe_customer_id?: string | null
          stripe_product_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          clicks: number | null
          created_at: string | null
          email_id: string | null
          id: string
          views: number | null
        }
        Insert: {
          clicks?: number | null
          created_at?: string | null
          email_id?: string | null
          id?: string
          views?: number | null
        }
        Update: {
          clicks?: number | null
          created_at?: string | null
          email_id?: string | null
          id?: string
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
      api_keys: {
        Row: {
          account_id: string | null
          created_at: string | null
          first_chars: string | null
          hashed_key: string | null
          id: string
          key: string | null
          last_used_at: string | null
          name: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          first_chars?: string | null
          hashed_key?: string | null
          id?: string
          key?: string | null
          last_used_at?: string | null
          name: string
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          first_chars?: string | null
          hashed_key?: string | null
          id?: string
          key?: string | null
          last_used_at?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          account_id: string | null
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          imported_at: string | null
          last_name: string | null
          phone_number: string | null
          source: string | null
          state: string | null
          subscribed_at: string | null
          unsubscribed_at: string | null
          verified_at: string | null
          zip_code: string | null
        }
        Insert: {
          account_id?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          imported_at?: string | null
          last_name?: string | null
          phone_number?: string | null
          source?: string | null
          state?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          verified_at?: string | null
          zip_code?: string | null
        }
        Update: {
          account_id?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          imported_at?: string | null
          last_name?: string | null
          phone_number?: string | null
          source?: string | null
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
          account_id: string | null
          content: string
          created_at: string | null
          from_email: string | null
          from_name: string | null
          id: string
          preview: string | null
          sent_at: string | null
          subject: string
        }
        Insert: {
          account_id?: string | null
          content: string
          created_at?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          preview?: string | null
          sent_at?: string | null
          subject: string
        }
        Update: {
          account_id?: string | null
          content?: string
          created_at?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          preview?: string | null
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
      list_contacts: {
        Row: {
          contact_id: string | null
          created_at: string | null
          id: string
          list_id: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          id?: string
          list_id?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          id?: string
          list_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "list_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "list_contacts_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          account_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          unique_identifier: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          unique_identifier?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          unique_identifier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lists_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      outbound_emails: {
        Row: {
          contact_id: string | null
          email_id: string | null
          id: string
          resend_id: string | null
          sent_at: string | null
        }
        Insert: {
          contact_id?: string | null
          email_id?: string | null
          id?: string
          resend_id?: string | null
          sent_at?: string | null
        }
        Update: {
          contact_id?: string | null
          email_id?: string | null
          id?: string
          resend_id?: string | null
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
      policy_logs: {
        Row: {
          created_at: string | null
          id: number
          message: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          message?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          account_id: string | null
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          last_login: string | null
        }
        Insert: {
          account_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          last_login?: string | null
        }
        Update: {
          account_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_login?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_api_key: {
        Args: {
          api_key: string
        }
        Returns: string
      }
      create_account_and_link_user: {
        Args: {
          name: string
          domain: string
          user_id: string
        }
        Returns: string
      }
      debug_jwt_claims: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_account_by_stripe_customer_id: {
        Args: {
          p_stripe_customer_id: string
        }
        Returns: {
          city: string | null
          country: string | null
          created_at: string | null
          domain: string
          domain_verified: boolean | null
          from_name: string | null
          id: string
          name: string
          plan_name: string | null
          postal_code: string | null
          resend_domain_id: string | null
          state: string | null
          street_address: string | null
          stripe_customer_id: string | null
          stripe_product_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
        }[]
      }
      get_accounts_for_authenticated_user: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_headers: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      hash_api_key: {
        Args: {
          api_key: string
        }
        Returns: string
      }
      log_policy_evaluation: {
        Args: {
          message: string
        }
        Returns: boolean
      }
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

