
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AlternativePaymentInfoProps {
  totalAmount: number;
}

const AlternativePaymentInfo: React.FC<AlternativePaymentInfoProps> = ({ totalAmount }) => (
  <Card className="bg-neon-purple/20 border-neon-purple border w-full">
    <CardContent className="p-6">
      <h4 className="font-semibold text-neon-pink mb-3 text-zinc-50">Alternative Payment</h4>
      <p className="text-white mb-4">
        You can also pay directly via M-PESA:
      </p>
      <div className="bg-barrush-charcoal/50 p-4 rounded-lg">
        <p className="text-center text-white">
          <strong className="text-neon-pink text-xl">Till Number: 5950470</strong>
        </p>
        <p className="text-center text-sm text-white/80 mt-2">
          Send KES {totalAmount.toLocaleString()} and contact us with your transaction ID
        </p>
      </div>
    </CardContent>
  </Card>
);

export default AlternativePaymentInfo;
