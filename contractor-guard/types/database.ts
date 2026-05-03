export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          role: "user" | "admin";
          credits_balance: number;
          tier: "free" | "pro";
          created_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          role?: "user" | "admin";
          credits_balance?: number;
          tier?: "free" | "pro";
          created_at?: string;
        };
        Update: {
          email?: string | null;
          role?: "user" | "admin";
          credits_balance?: number;
          tier?: "free" | "pro";
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          name?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          project_id: string;
          type: "TZ" | "Result";
          raw_text: string | null;
          file_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          type: "TZ" | "Result";
          raw_text?: string | null;
          file_url?: string | null;
          created_at?: string;
        };
        Update: {
          raw_text?: string | null;
          file_url?: string | null;
        };
      };
      audits: {
        Row: {
          id: string;
          project_id: string;
          status: "pending" | "processing" | "success" | "failed";
          score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          status?: "pending" | "processing" | "success" | "failed";
          score?: number | null;
          created_at?: string;
        };
        Update: {
          status?: "pending" | "processing" | "success" | "failed";
          score?: number | null;
        };
      };
      audit_results: {
        Row: {
          id: string;
          audit_id: string;
          requirement: string;
          finding: string | null;
          status: "ok" | "partial" | "fail";
          created_at: string;
        };
        Insert: {
          id?: string;
          audit_id: string;
          requirement: string;
          finding?: string | null;
          status: "ok" | "partial" | "fail";
          created_at?: string;
        };
        Update: {
          requirement?: string;
          finding?: string | null;
          status?: "ok" | "partial" | "fail";
        };
      };
      chunks: {
        Row: {
          id: string;
          document_id: string;
          content: string;
          embedding: number[];
        };
        Insert: {
          id?: string;
          document_id: string;
          content: string;
          embedding: number[];
        };
        Update: {
          content?: string;
          embedding?: number[];
        };
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: "purchase" | "usage" | "refund";
          audit_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: "purchase" | "usage" | "refund";
          audit_id?: string | null;
          created_at?: string;
        };
        Update: {
          amount?: number;
          type?: "purchase" | "usage" | "refund";
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          status: string | null;
          current_period_end: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          status?: string | null;
          current_period_end?: string | null;
          created_at?: string;
        };
        Update: {
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          status?: string | null;
          current_period_end?: string | null;
        };
      };
    };
    Views: {};
    Functions: {
      add_credits: {
        Args: { user_id: string; amount: number };
        Returns: void;
      };
      deduct_credits: {
        Args: { user_id: string; amount: number };
        Returns: void;
      };
      match_chunks: {
        Args: {
          query_embedding: number[];
          doc_id: string;
          match_count: number;
        };
        Returns: {
          id: string;
          content: string;
          similarity: number;
        }[];
      };
    };
    Enums: {};
  };
}