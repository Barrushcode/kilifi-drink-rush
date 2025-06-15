import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
interface ZapierWebhookInputProps {
  zapierWebhookUrl: string;
  setZapierWebhookUrl: (url: string) => void;
}
const ZapierWebhookInput: React.FC<ZapierWebhookInputProps> = ({
  zapierWebhookUrl,
  setZapierWebhookUrl
}) => <Card className="bg-barrush-charcoal/80 border-pink-400 border w-full">
    
    
  </Card>;
export default ZapierWebhookInput;