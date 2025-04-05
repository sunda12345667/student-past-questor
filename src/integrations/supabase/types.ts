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
        Args: {
          user_id: string
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
