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
      group_members: {
        Row: {
          group_id: string
          id: string
          is_admin: boolean | null
          joined_at: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          is_admin?: boolean | null
          joined_at?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          is_admin?: boolean | null
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string | null
          group_id: string
          id: string
          reactions: Json | null
          sender_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string | null
          group_id: string
          id?: string
          reactions?: Json | null
          sender_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string | null
          group_id?: string
          id?: string
          reactions?: Json | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          email: string
          id: string
          location: string | null
          name: string
          phone: string | null
          role: string
          school: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          email: string
          id: string
          location?: string | null
          name: string
          phone?: string | null
          role?: string
          school?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          email?: string
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          role?: string
          school?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number
          id: string
          material_id: string
          purchase_date: string | null
          transaction_ref: string | null
          user_id: string
        }
        Insert: {
          amount: number
          id?: string
          material_id: string
          purchase_date?: string | null
          transaction_ref?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          id?: string
          material_id?: string
          purchase_date?: string | null
          transaction_ref?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "study_materials"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          referred_id: string
          referrer_id: string
          reward_amount: number | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id: string
          referrer_id: string
          reward_amount?: number | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id?: string
          referrer_id?: string
          reward_amount?: number | null
          status?: string | null
        }
        Relationships: []
      }
      session_attendees: {
        Row: {
          confirmed: boolean | null
          id: string
          session_id: string
          user_id: string
        }
        Insert: {
          confirmed?: boolean | null
          id?: string
          session_id: string
          user_id: string
        }
        Update: {
          confirmed?: boolean | null
          id?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_attendees_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_private: boolean | null
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          name: string
          owner_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      study_materials: {
        Row: {
          created_at: string | null
          description: string | null
          downloads: number | null
          featured: boolean | null
          file_url: string | null
          format: string
          id: string
          preview_text: string | null
          price: number
          seller_id: string
          status: string | null
          subject: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          featured?: boolean | null
          file_url?: string | null
          format?: string
          id?: string
          preview_text?: string | null
          price?: number
          seller_id: string
          status?: string | null
          subject: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          featured?: boolean | null
          file_url?: string | null
          format?: string
          id?: string
          preview_text?: string | null
          price?: number
          seller_id?: string
          status?: string | null
          subject?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          duration: number
          group_id: string
          host_id: string
          id: string
          location: string | null
          meeting_link: string | null
          session_date: string
          session_time: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: number
          group_id: string
          host_id: string
          id?: string
          location?: string | null
          meeting_link?: string | null
          session_date: string
          session_time: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: number
          group_id?: string
          host_id?: string
          id?: string
          location?: string | null
          meeting_link?: string | null
          session_date?: string
          session_time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_type: string
          acquired_at: string | null
          description: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          achievement_type: string
          acquired_at?: string | null
          description?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          achievement_type?: string
          acquired_at?: string | null
          description?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_challenges: {
        Row: {
          challenge_type: string
          completed_at: string | null
          created_at: string | null
          description: string | null
          expiry_date: string | null
          id: string
          progress: number | null
          reward: string
          status: string | null
          target: number
          title: string
          user_id: string
        }
        Insert: {
          challenge_type: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          progress?: number | null
          reward: string
          status?: string | null
          target: number
          title: string
          user_id: string
        }
        Update: {
          challenge_type?: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          progress?: number | null
          reward?: string
          status?: string | null
          target?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          cash_balance: number | null
          coins: number | null
          created_at: string | null
          id: string
          last_daily_spin: string | null
          study_streak: number | null
          user_id: string
        }
        Insert: {
          cash_balance?: number | null
          coins?: number | null
          created_at?: string | null
          id?: string
          last_daily_spin?: string | null
          study_streak?: number | null
          user_id: string
        }
        Update: {
          cash_balance?: number | null
          coins?: number | null
          created_at?: string | null
          id?: string
          last_daily_spin?: string | null
          study_streak?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
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
