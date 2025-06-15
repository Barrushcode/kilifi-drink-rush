
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ZapierWebhookInputProps {
  zapierWebhookUrl: string;
  setZapierWebhookUrl: (url: string) => void;
}

const ZapierWebhookInput: React.FC<ZapierWebhookInputProps> = ({ zapierWebhookUrl, setZapierWebhookUrl }) => (
  <Card className="bg-barrush-charcoal/80 border-pink-400 border w-full">
    <CardHeader>
      <CardTitle className="text-neon-pink">Zapier Integration</CardTitle>
    </CardHeader>
    <CardContent>
      <label className="block text-white mb-2 font-bold" htmlFor="zapierWebhook">Zapier Webhook URL</label>
      <Input
        id="zapierWebhook"
        placeholder="Paste your Zapier webhook URL here"
        value={zapierWebhookUrl}
        onChange={e => setZapierWebhookUrl(e.target.value)}
        className="bg-barrush-charcoal text-white border-pink-400"
      />
      <div className="text-xs text-gray-400 mt-2">
        <span>
          When you submit payment, order data will be sent to this URL for recordkeeping (Google Sheets, etc). 
          <a 
            href="https://zapier.com/app/zaps" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline text-pink-300 ml-1"
          >
            Set up your Zap here
          </a>
          .
        </span>
      </div>
    </CardContent>
  </Card>
);
export default ZapierWebhookInput;
