import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ShoppingBag } from 'lucide-react';

interface FeaturedEvent {
  id: string;
  name: string;
  description: string;
  officialSite: string;
  image: string;
  bundleTitle: string;
  bundleIcon: string;
  themeColor: string;
}

const featuredEvents: FeaturedEvent[] = [
  {
    id: 'journey-to-the-baobabs',
    name: 'Journey to the Baobabs 2025',
    description: "Kilifi's littest August weekend returns for the third year. Featuring a heavy lineup of Coastal performers and food vendors.",
    officialSite: 'https://www.quicket.co.za/events/314632-journey-to-the-baobabs-2025/?ref=link-campaign&lc=news2',
    image: '/lovable-uploads/4fff77ec-78a5-428b-b35b-4b7136ac6c92.png',
    bundleTitle: '🎵 Shop Journey Bundle',
    bundleIcon: '🎵',
    themeColor: 'from-teal-500/20 to-green-600/20'
  },
  {
    id: 'beneath-the-baobabs',
    name: 'Beneath the Baobabs Festival',
    description: "Kilifi's iconic NYE festival held in a baobab forest with DJs, art, and immersive experiences.",
    officialSite: 'https://beneaththebaobabs.com/beneath-the-baobabs-festival/',
    image: '/lovable-uploads/d3afdd56-6192-4a8d-86f3-2b0f9b1ed66f.png',
    bundleTitle: '🍾 Shop Baobabs Party Bundle',
    bundleIcon: '🍾',
    themeColor: 'from-amber-500/20 to-orange-600/20'
  },
  {
    id: 'kaleidoscope',
    name: 'Kaleidoscope Festival',
    description: "A biannual celebration of music, community, and color in Kilifi's vibrant cultural scene.",
    officialSite: 'https://www.kaleidoscope.wtf/',
    image: '/lovable-uploads/f36582da-bc1d-488b-9945-e28d111a4d2d.png',
    bundleTitle: '🍸 Shop Kaleidoscope Glow Bundle',
    bundleIcon: '🍸',
    themeColor: 'from-purple-500/20 to-pink-600/20'
  }
];

const FeaturedEventCard: React.FC<{ event: FeaturedEvent }> = ({ event }) => {
  const handleOfficialSiteClick = () => {
    window.open(event.officialSite, '_blank', 'noopener,noreferrer');
  };

  const handleBundleClick = () => {
    // For now, redirect to products page with a filter or specific bundle
    // This can be enhanced later to link to specific product bundles
    window.location.href = '/products?event=' + event.id;
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${event.themeColor} to-transparent`} />
        <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground backdrop-blur-sm">
          Featured Event
        </Badge>
      </div>
      
      <CardHeader className="space-y-3 pb-4">
        <CardTitle className="text-2xl font-serif group-hover:text-primary transition-colors duration-300">
          {event.name}
        </CardTitle>
        <CardDescription className="text-base leading-relaxed text-muted-foreground">
          {event.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleOfficialSiteClick}
            variant="outline" 
            className="flex-1 group/btn hover:border-primary/50 transition-all duration-300"
          >
            🎟️ View Official Event Info
            <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            onClick={handleBundleClick}
            variant="green"
            className="flex-1 group/btn"
          >
            {event.bundleTitle}
            <ShoppingBag className="ml-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturedEventsSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6 mb-12">
          <h2 className="text-3xl lg:text-5xl font-serif font-bold text-foreground">
            Featured Events
          </h2>
          <div className="w-24 h-0.5 bg-primary mx-auto"></div>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience Kilifi's most iconic festivals and celebrate with premium beverages from our curated event bundles.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {featuredEvents.map((event) => (
            <FeaturedEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEventsSection;