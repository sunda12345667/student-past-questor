
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InitializePaymentParams {
  email: string;
  amount: number;
  metadata: {
    userId: string;
    materialId?: string;
    packId?: string;
    service: string;
  };
}

interface VerifyPaymentParams {
  reference: string;
}

export const initializePayment = async ({
  email,
  amount,
  metadata,
}: InitializePaymentParams) => {
  try {
    const response = await fetch("/api/payment/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        metadata,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to initialize payment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Payment initialization error:", error);
    toast.error("Payment initialization failed. Please try again.");
    throw error;
  }
};

export const verifyPayment = async ({ reference }: VerifyPaymentParams) => {
  try {
    const response = await fetch(`/api/payment/verify/${reference}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to verify payment");
    }

    const data = await response.json();
    
    if (data.status === "success") {
      toast.success("Payment verified successfully!");
    } else {
      toast.error("Payment verification failed.");
    }
    
    return data;
  } catch (error) {
    console.error("Payment verification error:", error);
    toast.error("Payment verification failed. Please contact support.");
    throw error;
  }
};

export const checkPurchaseStatus = async (userId: string, materialId: string) => {
  try {
    const { data, error } = await supabase
      .from("purchases")
      .select("*")
      .eq("user_id", userId)
      .eq("material_id", materialId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows returned
      console.error("Error checking purchase status:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error checking purchase status:", error);
    return false;
  }
};

export const recordPurchase = async (
  userId: string,
  materialId: string,
  amount: number,
  transactionRef: string
) => {
  try {
    const { data, error } = await supabase.from("purchases").insert({
      user_id: userId,
      material_id: materialId,
      amount,
      transaction_ref: transactionRef,
    });

    if (error) {
      console.error("Error recording purchase:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error recording purchase:", error);
    throw error;
  }
};
