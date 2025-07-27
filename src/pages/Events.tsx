import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import FeaturedEventsSection from '@/components/FeaturedEventsSection';
import SEOHead from '@/components/SEOHead';

// Sample events data - this could later come from a database
const upcomingEvents = [
  {
    id: 1,
    title: "🧠 Trivia Night",
    description: "Fun, team-based adult game night – good for groups of friends, couples, or coworkers. Free tequila shots & a lunch voucher worth KES 500.00!",
    date: "2025-08-08",
    time: "7:00 PM – 9:00 PM",
    location: "Salty's (www.saltyskitesurf.com)",
    category: "Entertainment",
    image: "/lovable-uploads/81aa873d-120d-4937-a946-92c7b398d971.png",
    attendees: "2-6 people per squad",
    featured: true,
    host: "Kaz",
    entry: "Free",
    contact: "+254 794 449 196"
  },
  {
    id: 2,
    title: "🎧 Salty's Social: Kamushez DJ Set",
    description: "Chill, danceable beach party with a DJ set, ideal for nightlife and party lovers.",
    date: "2025-08-09",
    time: "9:00 PM",
    location: "Salty's Social – www.saltyskitesurf.com",
    category: "Music",
    image: "/lovable-uploads/d4d78ce6-0458-4617-b6b9-8856b228637f.png",
    attendees: "Open",
    artist: "Kamushez",
    entry: "Free or venue entry"
  },
  {
    id: 3,
    title: "🌴 Salty's Social: Krish, Rich Mvazi, Evan Rhodes",
    description: "High-energy, party by the sea with a diverse music lineup featuring three amazing DJs!",
    date: "2025-08-15",
    time: "8:00 PM",
    location: "Salty's Social – www.saltyskitesurf.com",
    category: "Music",
    image: "/lovable-uploads/73d2618a-4ea2-43cc-849d-c01f033f5351.png",
    attendees: "Open",
    featured: true,
    lineup: "KRISH, RICH MVAZI, EVAN RHODES",
    entry: "KES 500"
  }
];

const recentEvents = [
  {
    id: 4,
    title: "Kilifi Food & Wine Expo",
    description: "Three-day expo featuring local restaurants and imported wines",
    date: "2024-07-10",
    time: "12:00",
    location: "Kilifi Sports Club",
    category: "Food & Wine",
    image: "/lovable-uploads/eed458a0-c82d-483b-b67a-887e67da1b9c.png",
    attendees: "800+"
  },
  {
    id: 5,
    title: "Wildlife Conservation Awareness",
    description: "Educational event about local marine life and conservation efforts",
    date: "2024-06-25",
    time: "09:00",
    location: "Kilifi Nature Reserve",
    category: "Education",
    image: "/lovable-uploads/44a4a4ba-cffd-475b-9ee9-b01cb49950c1.png",
    attendees: "300"
  }
];

const EventCard: React.FC<{
  event: any;
  isUpcoming?: boolean;
}> = ({ event, isUpcoming = true }) => {
  const eventDate = new Date(event.date);
  const isToday = eventDate.toDateString() === new Date().toDateString();
  
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${event.featured ? 'ring-2 ring-primary/20' : ''}`}>
      <div className="relative overflow-hidden rounded-t-lg h-56 md:h-64">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {event.featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground shadow-lg">
            Featured
          </Badge>
        )}
        <Badge 
          variant={isUpcoming ? "default" : "secondary"} 
          className="absolute top-3 right-3 shadow-lg"
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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full group" variant="outline">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="space-y-6">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-auto rounded-lg"
                />
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{event.title}</h2>
                  <p className="text-muted-foreground">{event.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span><strong>Date:</strong> {eventDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span><strong>Time:</strong> {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span><strong>Location:</strong> {event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span><strong>Attendees:</strong> {event.attendees}</span>
                    </div>
                    {event.entry && (
                      <div>
                        <span><strong>Entry:</strong> {event.entry}</span>
                      </div>
                    )}
                    {event.host && (
                      <div>
                        <span><strong>Host:</strong> {event.host}</span>
                      </div>
                    )}
                    {event.contact && (
                      <div>
                        <span><strong>Contact:</strong> {event.contact}</span>
                      </div>
                    )}
                    {event.artist && (
                      <div>
                        <span><strong>Artist:</strong> {event.artist}</span>
                      </div>
                    )}
                    {event.lineup && (
                      <div>
                        <span><strong>Lineup:</strong> {event.lineup}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

const Events: React.FC = () => {
  const eventsStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Events in Kilifi County",
    "description": "Upcoming events, festivals, and entertainment in Kilifi County, Kenya",
    "url": "https://barrush.lovable.app/events",
    "itemListElement": upcomingEvents.map((event, index) => ({
      "@type": "Event",
      "position": index + 1,
      "name": event.title,
      "description": event.description,
      "startDate": event.date + "T" + event.time.split(" ")[0],
      "location": {
        "@type": "Place",
        "name": event.location,
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "Kenya",
          "addressRegion": "Kilifi County"
        }
      },
      "organizer": {
        "@type": "Organization",
        "name": event.host || "Salty's",
        "url": "https://saltyskitesurf.com"
      },
      "offers": {
        "@type": "Offer",
        "price": event.entry === "Free" ? "0" : event.entry.replace("KES ", ""),
        "priceCurrency": "KES",
        "availability": "https://schema.org/InStock"
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Trivia Night Salty's | Kamushez DJ Set | Krish Rich Mvazi Evan Rhodes | Events Kilifi County Kenya | Barrush"
        description="Join Trivia Night at Salty's, Kamushez DJ Set, Krish Rich Mvazi Evan Rhodes lineup, Food & Wine Expo, Wildlife Conservation events in Kilifi County. Premium alcohol delivery for all events."
        keywords="Trivia Night Salty's Kilifi, Kamushez DJ Set Kilifi, Krish Rich Mvazi Evan Rhodes, Salty's Social events, Kilifi Food Wine Expo, Wildlife Conservation Kilifi, events Kilifi County, beach parties Salty's, DJ sets Kilifi, entertainment Kenya, event alcohol delivery Kilifi, nightlife Kilifi Kenya"
        url="https://barrush.lovable.app/events"
        structuredData={eventsStructuredData}
      />
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
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => window.location.href = 'mailto:barrushdelivery@gmail.com'}
            >
              Contact Us for Events
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;