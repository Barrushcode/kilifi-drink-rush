import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowLeft, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import { upcomingEvents } from '@/data/eventsData';


const EventDetail: React.FC = () => {
  const { eventSlug } = useParams<{ eventSlug: string }>();
  const event = upcomingEvents.find(e => e.slug === eventSlug);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Event Not Found</h1>
          <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
          <Link to="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isToday = eventDate.toDateString() === new Date().toDateString();

  const shareEvent = async () => {
    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title} on ${eventDate.toLocaleDateString()} at ${event.location}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert('Event details copied to clipboard!');
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
    }
  };

  const eventStructuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
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
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${event.title} | Events Kilifi County Kenya | Barrush`}
        description={`${event.description} Join us on ${eventDate.toLocaleDateString()} at ${event.location}. Premium alcohol delivery available for all events in Kilifi County.`}
        keywords={`${event.title}, ${event.category}, Kilifi events, ${event.location}, Kenya events, alcohol delivery Kilifi`}
        url={`https://barrush.lovable.app/events/${event.slug}`}
        structuredData={eventStructuredData}
      />

      {/* Header */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <Link to="/events" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </div>
      </section>

      {/* Event Detail */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-96 object-cover"
                />
                {event.featured && (
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground shadow-lg">
                    Featured
                  </Badge>
                )}
                <Badge 
                  variant="default" 
                  className="absolute top-4 right-4 shadow-lg"
                >
                  {event.category}
                </Badge>
              </div>
              
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{eventDate.toLocaleDateString()}</span>
                    {isToday && <Badge variant="destructive" className="text-xs">Today</Badge>}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={shareEvent}
                    title="Share this event"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardTitle className="text-3xl">
                  {event.title}
                </CardTitle>
                
                <CardDescription className="text-base leading-relaxed">
                  {event.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span><strong>Time:</strong> {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span><strong>Attendees:</strong> {event.attendees}</span>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span><strong>Location:</strong> {event.location}</span>
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
                
                {event.signupLink && (
                  <div className="pt-6 border-t">
                    <Button 
                      asChild 
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <a 
                        href={event.signupLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Sign Up for Event
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Events */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Other Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {upcomingEvents
              .filter(e => e.id !== event.id)
              .slice(0, 3)
              .map((relatedEvent) => (
                <Link key={relatedEvent.id} to={`/events/${relatedEvent.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="relative overflow-hidden rounded-t-lg h-48">
                      <img 
                        src={relatedEvent.image} 
                        alt={relatedEvent.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {relatedEvent.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(relatedEvent.date).toLocaleDateString()}</span>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetail;