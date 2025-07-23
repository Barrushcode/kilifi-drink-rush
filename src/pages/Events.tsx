import React from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FeaturedEventsSection from '@/components/FeaturedEventsSection';

// Sample events data - this could later come from a database
const upcomingEvents = [
  {
    id: 1,
    title: "Journey to the Baobabs 2025",
    description: "Kilifi's littest August weekend returns for the third year. Featuring a heavy lineup of Coastal performers and food and vendors.",
    date: "2025-08-16",
    time: "16:30",
    location: "Beneath the Baobabs Venue, Kilifi, Kenya",
    category: "Music Festival",
    image: "/lovable-uploads/4fff77ec-78a5-428b-b35b-4b7136ac6c92.png",
    attendees: "1500",
    featured: true,
    ticketLink: "https://www.quicket.co.za/events/314632-journey-to-the-baobabs-2025/?ref=link-campaign&lc=news2"
  },
  {
    id: 2,
    title: "Saffron Garden Picnic & Paint",
    description: "Unique painting session filled with fun memories. Bring your stylish picnic basket and join us for art, cocktails, and creativity.",
    date: "2025-07-27",
    time: "14:00",
    location: "Saffron Garden Malindi (Old La Malindino)",
    category: "Art & Culture",
    image: "/lovable-uploads/3d290029-10cb-406d-9184-32ccfffb2606.png",
    attendees: "Limited",
    featured: true,
    dressCode: "Happy Bold Colours",
    pricing: "Adults KES 1900, Kids KES 1500"
  },
  {
    id: 3,
    title: "Sunset Yacht Party",
    description: "Exclusive sunset cruise with premium drinks and DJ entertainment",
    date: "2024-08-02",
    time: "17:30",
    location: "Kilifi Creek Marina",
    category: "Party",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop",
    attendees: "150"
  },
  {
    id: 4,
    title: "Local Art & Culture Night",
    description: "Showcase of local artists, traditional dances, and craft exhibitions",
    date: "2024-07-28",
    time: "19:00",
    location: "Kilifi Cultural Center",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop",
    attendees: "200+"
  }
];

const recentEvents = [
  {
    id: 5,
    title: "Kilifi Food & Wine Expo",
    description: "Three-day expo featuring local restaurants and imported wines",
    date: "2024-07-10",
    time: "12:00",
    location: "Kilifi Sports Club",
    category: "Food & Wine",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop",
    attendees: "800+"
  },
  {
    id: 6,
    title: "Wildlife Conservation Awareness",
    description: "Educational event about local marine life and conservation efforts",
    date: "2024-06-25",
    time: "09:00",
    location: "Kilifi Nature Reserve",
    category: "Education",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop",
    attendees: "300"
  }
];

const EventCard: React.FC<{
  event: typeof upcomingEvents[0];
  isUpcoming?: boolean;
}> = ({ event, isUpcoming = true }) => {
  const eventDate = new Date(event.date);
  const isToday = eventDate.toDateString() === new Date().toDateString();
  
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${event.featured ? 'ring-2 ring-primary/20' : ''}`}>
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {event.featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
        <Badge 
          variant={isUpcoming ? "default" : "secondary"} 
          className="absolute top-3 right-3"
        >
          {event.category}
        </Badge>
      </div>
      
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{eventDate.toLocaleDateString()}</span>
          {isToday && <Badge variant="destructive" className="text-xs">Today</Badge>}
        </div>
        
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {event.title}
        </CardTitle>
        
        <CardDescription className="text-sm">
          {event.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{event.attendees}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
        </div>
        
        {isUpcoming && (
          <Button className="w-full group" variant="outline">
            Learn More
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const Events: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-foreground">
              Events in Kilifi
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the vibrant culture and exciting happenings in Kilifi County. 
              From beach festivals to cultural celebrations, there's always something amazing happening.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <FeaturedEventsSection />

      {/* Upcoming Events */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on these exciting upcoming events in Kilifi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} isUpcoming={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Recent Events
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take a look at some of the amazing events we've recently hosted
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {recentEvents.map((event) => (
              <EventCard key={event.id} event={event} isUpcoming={false} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary/5 rounded-2xl p-8 lg:p-12 text-center space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">
              Planning an Event?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Partner with Barrush for your event's beverage needs. We provide premium alcohol delivery 
              and catering services for events of all sizes in Kilifi County.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Contact Us for Events
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;