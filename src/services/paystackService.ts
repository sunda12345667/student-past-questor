
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

// Response type for initializePayment to make TypeScript happy
interface PaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

// Mock implementation to avoid payment issues while debugging auth
export const initializePayment = async ({
  email,
  amount,
  metadata,
}: InitializePaymentParams): Promise<PaymentResponse> => {
  // Mock success response for debugging
  toast.info("Payment processing temporarily disabled for maintenance");
  console.log("Mocked payment initialization", { email, amount, metadata });
  
  return {
    status: true,
    message: "Payment is temporarily disabled for maintenance",
    data: {
      authorization_url: "#",
      access_code: "mock_access",
      reference: `mock-ref-${Date.now()}`
    }
  };
};

export const verifyPayment = async ({ reference }: VerifyPaymentParams) => {
  // Mock success response for debugging
  console.log("Mocked payment verification for reference:", reference);
  
  return {
    status: "success",
    message: "Payment verification is temporarily disabled for maintenance",
    amount: 1000,
    reference
  };
};

export const checkPurchaseStatus = async (userId: string, materialId: string) => {
  try {
    const { data, error } = await supabase
      .from("purchases")
      .select("*")
      .eq("user_id", userId)
      .eq("material_id", materialId)
      .maybeSingle();

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
    console.log("Recording mock purchase", { userId, materialId, amount, transactionRef });
    // Return mock success without actually writing to database for now
    return { success: true };
    
    /* Original code commented out
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
    */
  } catch (error) {
    console.error("Error recording purchase:", error);
    throw error;
  }
};

// Add the missing function that's being imported in SampleQuestions.tsx
export const processQuestionPackPurchase = async (
  packId: string,
  title: string,
  amount: number
) => {
  try {
    // Mock implementation - in a real app, this would call initializePayment
    toast.info(`Payment processing for ${title} temporarily disabled for maintenance`);
    console.log("Mock question pack purchase", { packId, title, amount });
    return { success: true, reference: `mock-ref-${Date.now()}` };
  } catch (error) {
    console.error("Error processing question pack purchase:", error);
    throw error;
  }
};
