import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import FeaturedEventsSection from '@/components/FeaturedEventsSection';
import SEOHead from '@/components/SEOHead';
import { upcomingEvents, recentEvents } from '@/data/eventsData';
const EventCard: React.FC<{
  event: any;
  isUpcoming?: boolean;
}> = ({
  event,
  isUpcoming = true
}) => {
  const eventDate = new Date(event.date);
  const isToday = eventDate.toDateString() === new Date().toDateString();
  const shareEvent = async () => {
    const eventUrl = event.slug ? `${window.location.origin}/events/${event.slug}` : `${window.location.origin}/events#event-${event.id}`;
    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title} on ${eventDate.toLocaleDateString()} at ${event.location}`,
      url: eventUrl
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        // You could add a toast notification here
        alert('Event details copied to clipboard!');
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
    }
  };
  return <Card id={`event-${event.id}`} className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${event.featured ? 'ring-2 ring-primary/20' : ''}`}>
      <div className="relative overflow-hidden rounded-t-lg h-56 md:h-64">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" loading="lazy" onError={e => {
        e.currentTarget.style.display = 'none';
      }} />
        {event.featured && <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground shadow-lg">
            Featured
          </Badge>}
        <Badge variant={isUpcoming ? "default" : "secondary"} className="absolute top-3 right-3 shadow-lg">
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
        
        <div className="flex gap-2">
          {isUpcoming && <Dialog>
              <DialogTrigger asChild>
                <Button className="flex-1 group" variant="outline">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="space-y-6">
                  <img src={event.image} alt={event.title} className="w-full h-auto rounded-lg" />
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
                      {event.entry && <div className="flex items-center gap-2">
                          <span><strong>Entry:</strong> {event.entry}</span>
                          {event.entry.toLowerCase().includes('free') && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              FREE
                            </Badge>
                          )}
                        </div>}
                      {event.host && <div>
                          <span><strong>Host:</strong> {event.host}</span>
                        </div>}
                      {event.contact && <div>
                          <span><strong>Contact:</strong> {event.contact}</span>
                        </div>}
                      {event.artist && <div>
                          <span><strong>Artist:</strong> {event.artist}</span>
                        </div>}
                      {event.lineup && <div>
                          <span><strong>Lineup:</strong> {event.lineup}</span>
                        </div>}
                    </div>
                    
                    {event.signupLink && <div className="mt-6 space-y-3">
                        <Button asChild className="w-full bg-primary hover:bg-primary/90">
                          <a href={event.signupLink} target="_blank" rel="noopener noreferrer">
                            Sign Up for Event
                          </a>
                        </Button>
                      </div>}
                    
                    <div className="mt-4 space-y-3">
                      <Button variant="outline" className="w-full" onClick={() => {
                        const eventUrl = event.slug ? `${window.location.origin}/events/${event.slug}` : `${window.location.origin}/events#event-${event.id}`;
                        navigator.clipboard.writeText(eventUrl);
                        alert('Event link copied to clipboard!');
                      }}>
                        Copy Event Link
                      </Button>
                      
                      <Button variant="outline" className="w-full" onClick={() => {
                        const startDate = new Date(event.date + 'T' + event.time.split(' ')[0]);
                        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours
                        
                        const calendarEvent = {
                          title: event.title,
                          start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
                          end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
                          description: event.description,
                          location: event.location
                        };
                        
                        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarEvent.title)}&dates=${calendarEvent.start}/${calendarEvent.end}&details=${encodeURIComponent(calendarEvent.description)}&location=${encodeURIComponent(calendarEvent.location)}`;
                        window.open(googleCalendarUrl, '_blank');
                      }}>
                        Add to Calendar
                      </Button>
                      
                      <Button variant="outline" className="w-full" onClick={() => {
                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
                        window.open(mapsUrl, '_blank');
                      }}>
                        View on Maps
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>}
          
          <Button variant="outline" size="icon" onClick={shareEvent} className="shrink-0" title="Share this event">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>;
};
const Events: React.FC = () => {
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [showRecentEvents, setShowRecentEvents] = useState(false);
  
  // Sort events by date (upcoming soonest to latest)
  const sortedUpcomingEvents = [...upcomingEvents].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const currentUpcomingEvents = sortedUpcomingEvents.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    
    // Always show recurring events as upcoming
    if (event.isRecurring || (event.recurring && event.recurring !== '')) {
      return true;
    }
    
    return eventDate >= today;
  });
  
  const pastEvents = sortedUpcomingEvents.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    
    // Never show recurring events as past
    if (event.isRecurring || (event.recurring && event.recurring !== '')) {
      return false;
    }
    
    return eventDate < today;
  });

  // Get featured events for the "What We Featured" section
  const featuredEvents = currentUpcomingEvents.filter(event => event.featured);

  // Handle scrolling to event on page load if hash exists
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 500);
      }
    }
  }, []);
  const eventsStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Events in Kilifi County",
    "description": "Upcoming events, festivals, and entertainment in Kilifi County, Kenya",
    "url": "https://barrush.lovable.app/events",
    "itemListElement": currentUpcomingEvents.map((event, index) => ({
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
        "price": !event.entry || event.entry === "Free" ? "0" : event.entry.replace("KES ", ""),
        "priceCurrency": "KES",
        "availability": "https://schema.org/InStock"
      }
    }))
  };
  return <div className="min-h-screen bg-background">
      <SEOHead title="Trivia Night Salty's | Kamushez DJ Set | Krish Rich Mvazi Evan Rhodes | Events Kilifi County Kenya | Barrush" description="Join Trivia Night at Salty's, Kamushez DJ Set, Krish Rich Mvazi Evan Rhodes lineup, Food & Wine Expo, Wildlife Conservation events in Kilifi County. Premium alcohol delivery for all events." keywords="Trivia Night Salty's Kilifi, Kamushez DJ Set Kilifi, Krish Rich Mvazi Evan Rhodes, Salty's Social events, Kilifi Food Wine Expo, Wildlife Conservation Kilifi, events Kilifi County, beach parties Salty's, DJ sets Kilifi, entertainment Kenya, event alcohol delivery Kilifi, nightlife Kilifi Kenya" url="https://barrush.lovable.app/events" structuredData={eventsStructuredData} />
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
        
        {/* Event Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button 
            onClick={() => setShowPastEvents(!showPastEvents)}
            variant={showPastEvents ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            {showPastEvents ? "Hide" : "Show"} Past Events
            <Badge variant="secondary">{pastEvents.length}</Badge>
          </Button>
          <Button 
            onClick={() => setShowRecentEvents(!showRecentEvents)}
            variant={showRecentEvents ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            {showRecentEvents ? "Hide" : "Show"} Recent Events
            <Badge variant="secondary">{recentEvents.length}</Badge>
          </Button>
        </div>
      </section>

      {/* What We Featured Section */}
      {featuredEvents.length > 0}

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
            {currentUpcomingEvents.map(event => <EventCard key={event.id} event={event} isUpcoming={true} />)}
          </div>
        </div>
      </section>

      {/* Past Events */}
      {showPastEvents && pastEvents.length > 0 && <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Past Events
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Events that have already taken place
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {pastEvents.slice(0, 4).map(event => <EventCard key={event.id} event={event} isUpcoming={false} />)}
            </div>
          </div>
        </section>}

      {/* Recent Events */}
      {showRecentEvents && <section className="py-16 lg:py-20 bg-muted/50">
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
            {recentEvents.map(event => <EventCard key={event.id} event={event} isUpcoming={false} />)}
          </div>
        </div>
      </section>}

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
            <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = 'mailto:events@barrush.co.ke'}>
              Contact Us for Events
            </Button>
          </div>
        </div>
      </section>
    </div>;
};
export default Events;