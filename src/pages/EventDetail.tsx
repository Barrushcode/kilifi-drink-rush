import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowLeft, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';

// Import the same events data from Events page
const upcomingEvents = [
  {
    id: 1,
    slug: 'element-sessions',
    title: "🌋 Element Sessions",
    description: "Experience an electrifying night of underground beats and immersive energy at Element Sessions inside the iconic Rave Cave. A sonic journey curated by top-tier DJs and electronic music selectors.",
    date: "2025-08-02",
    time: "10:00 PM till late",
    location: "Tulia House, Nyali – Rave Cave",
    category: "Electronic",
    image: "/lovable-uploads/2ac035de-591e-48e6-8b49-234dde72234e.png",
    attendees: "Open",
    featured: true,
    host: "The Rave Cave",
    lineup: ["St. Michael", "Middleman", "Fed", "Saul Bucho"]
  },
  {
    id: 2,
    slug: 'afro-social',
    title: "🏖️ Afro Social",
    description: "Afro Social is your beachside day-to-night party featuring good vibes, great music, and the best Afro mixes. Chill, dance, and connect under the sun and stars at Fisherman's Creek.",
    date: "2025-08-09",
    time: "2:00 PM till late",
    location: "Fisherman's Creek",
    category: "Afro",
    image: "/lovable-uploads/9f492951-e9df-4513-b498-4791855e5fc8.png",
    attendees: "Open",
    featured: true,
    host: "Fisherman's Creek",
    entry: "KES 500",
    lineup: ["DJ HMZ", "DJ Chef P", "DJ Audra", "DJ Kenia", "DJ Jean", "DJ Saul Bucho"],
    sponsor: "Kenyan Originals – KO Pineapple & Mint Cider",
    contact: "0724 375 478",
    tillNumber: "1661580"
  },
  {
    id: 3,
    slug: 'trivia-night',
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
    slug: 'kamushez-dj-set',
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
    slug: 'krish-rich-mvazi-evan-rhodes',
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
  },
  {
    id: 4,
    slug: 'happy-soko',
    title: "🎪 A Happy Soko",
    description: "A Happy Soko is a community-driven outdoor marketplace and cultural festival designed to uplift local entrepreneurs, celebrate Kenyan creativity, and spark meaningful human connections. Powered by A Happy Society, this event blends commerce, music, wellness, and storytelling into a vibrant open-air experience for the Kilifi community and beyond. This second edition builds on the success of our June 2025 debut, bringing together SMEs, artists, DJs, and health partners in a curated day-to-night activation of Kilifi's creative spirit — all in the name of freedom, flavor, and festivity.",
    date: "2025-08-30",
    time: "10:00 AM till late",
    location: "Mazingira Park",
    category: "Festival",
    image: "/lovable-uploads/e9853dfa-366d-48a2-b18f-e7fa248cea96.png",
    attendees: "Open",
    featured: true,
    host: "A Happy Society",
    entry: "Various vendor options",
    signupLink: "https://forms.gle/3FVv9oi5gfc4fb9h7"
  },
  {
    id: 5,
    slug: 'afro-carnival-beach-exp',
    title: "🎵 Afro Carnival: Beach Exp.",
    description: "Get ready for a vibrant beach experience filled with Afro House, Amapiano, Afro Beats & ArbanTone. Curated by the Ministry of Enjoyment and featuring top DJ Saul Bucho, this is the ultimate beach party of the year!",
    date: "2025-08-16",
    time: "All Day",
    location: "Moonshine Beach Club",
    category: "Music",
    image: "/lovable-uploads/6fbed43c-70e6-43dc-8096-71e36d555174.png",
    attendees: "Open",
    featured: true,
    host: "Ministry of Enjoyment",
    artist: "Saul Bucho",
    entry: "Early Bird – KSH 500, Gate – KSH 1,000",
    signupLink: "https://afrocarnival.hustlesasa.shop/"
  },
  {
    id: 6,
    slug: 'dance-with-dee',
    title: "💃 Dance With Dee",
    description: "Hello, I'm Diana — or Dee — a dance fitness instructor based in Kilifi. Join me for high-energy Zumba and Zoca dance sessions designed to get your body moving for fitness, fun, and pure vibes! Whether you're a beginner or a pro, it's all about joy and movement.",
    date: "2025-08-05",
    time: "Tuesday & Thursday, 5:30 PM – 6:30 PM",
    location: "Kilifi Recreational Center - Behind Express Shop",
    category: "Fitness",
    image: "/lovable-uploads/e17c9f6d-ac8c-4707-8b62-84448646cde8.png",
    attendees: "Open",
    host: "Diana (Dee) – Zumba & Zoca Dance Coach",
    entry: "KES 500",
    contact: "0723998309",
    recurring: "Tuesday & Thursday"
  }
];

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