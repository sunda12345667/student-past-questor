import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment } from "@/services/paystackService";
import Layout from "@/components/Layout";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyTransaction = async () => {
      if (!reference) {
        setStatus("error");
        return;
      }

      try {
        const response = await verifyPayment({ reference });
        setPaymentDetails(response);
        
        if (response.status === "success") {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("error");
      }
    };

    verifyTransaction();
  }, [reference]);

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16 flex justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Payment {status === "loading" ? "Processing" : status === "success" ? "Successful" : "Failed"}</CardTitle>
            <CardDescription>
              {status === "loading" ? "Please wait while we verify your payment..." : 
               status === "success" ? "Your transaction has been completed successfully" : 
               "We couldn't verify your payment"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center py-6">
            {status === "loading" ? (
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            ) : status === "success" ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
            
            {status !== "loading" && (
              <div className="mt-6 text-left w-full">
                <div className="mb-1"><strong>Reference:</strong> {reference}</div>
                {paymentDetails && paymentDetails.amount && (
                  <div className="mb-1"><strong>Amount:</strong> ₦{(paymentDetails.amount / 100).toLocaleString()}</div>
                )}
                {status === "success" ? (
                  <p className="mt-4 text-center text-green-600">
                    Your purchase was successful. You can now access the materials in your downloads section.
                  </p>
                ) : (
                  <p className="mt-4 text-center text-red-600">
                    There was a problem verifying your payment. If you believe this is an error, please contact support.
                  </p>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2">
            {status === "success" ? (
              <>
                <Button className="w-full" onClick={() => navigate("/dashboard?tab=downloads")}>
                  Go to Downloads
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard?tab=marketplace")}>
                  Back to Marketplace
                </Button>
              </>
            ) : status === "error" ? (
              <>
                <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard?tab=marketplace")}>
                  Back to Marketplace
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </>
            ) : null}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
