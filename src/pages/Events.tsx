import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import FeaturedEventsSection from '@/components/FeaturedEventsSection';
import SEOHead from '@/components/SEOHead';

// Sample events data - this could later come from a database
const upcomingEvents = [
  {
    id: 7,
    slug: 'sunday-brunch-billionaire',
    title: "🌞 Sunday Brunch at Billionaire",
    description: "Spend your Sundays beachside at the luxurious Billionaire Resort in Malindi. Enjoy a gourmet brunch with refreshing drinks, smooth beats by a live DJ, and ocean views. Perfect for families and foodies alike.",
    date: "2025-08-03",
    time: "1:00 PM – 3:00 PM",
    location: "Billionaire Beach Bar and Grill, Malindi",
    category: "Dining",
    image: "/lovable-uploads/719ffcdf-4dc5-4cdc-a53e-947d9a95d8b1.png",
    attendees: "Open",
    featured: true,
    host: "Billionaire Resort & Retreat",
    entry: "KES 5,000 (Prepay & prebook by Saturday)",
    specialOffer: "50% discount for children under 12",
    contact: "0705 437 307",
    recurring: "Every Sunday"
  },
  {
    id: 8,
    slug: 'themed-dinner-nights-billionaire',
    title: "🍣 Themed Dinner Nights at Billionaire",
    description: "Embark on a unique culinary journey each Thursday at Billionaire's Themed Dinner Nights. Taste global flavors in a stylish beachfront setting with a DJ spinning all evening. From the bold flavors of Spain to the rich traditions of ancient Rome, and the delicate elegance of Japanese cuisine.",
    date: "2025-08-01",
    time: "Evening",
    location: "Billionaire Resort & Retreat, Malindi",
    category: "Dining",
    image: "/lovable-uploads/b92eff9e-b6bd-44d0-a466-2ac248442a02.png",
    attendees: "Open",
    featured: true,
    host: "Billionaire Resort & Retreat",
    entry: "KES 5,000 per person",
    specialOffer: "A welcome drink is included",
    contact: "0705 437 307",
    themes: "1st August – Japanese Night, 8th August – Spanish Night, 22nd August – Cena Romana (Roman Night)"
  },
  {
    id: 9,
    slug: 'fashion-brunch-billionaire',
    title: "👗 Fashion Brunch – Billionaire Resort",
    description: "Step into style at the Fashion Brunch – a glamorous midday affair where brunch meets the runway. Sip, savor, and socialize in an elegant beachfront setting, accompanied by great music and even better company. Come dressed to impress.",
    date: "2025-09-07",
    time: "12:30 PM – 3:30 PM",
    location: "Billionaire Resort & Retreat, Malindi",
    category: "Fashion",
    image: "/lovable-uploads/998b9c7a-a360-488e-b4f1-6e6aa2925186.png",
    attendees: "Open",
    featured: true,
    host: "Billionaire Resort & Retreat",
    entry: "Late Bloomers: KES 5,500 (Advance), At the Gate: KES 6,500",
    specialOffer: "Gourmet brunch, curated cocktails, fashion ambiance, and seaside luxury included",
    contact: "0705 437 307"
  },
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
  
  return (
    <Card 
      id={`event-${event.id}`}
      className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${event.featured ? 'ring-2 ring-primary/20' : ''}`}
    >
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
        
        <div className="flex gap-2">
          {isUpcoming && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex-1 group" variant="outline">
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
                    
                    {event.signupLink && (
                      <div className="mt-6 space-y-3">
                        <Button 
                          asChild 
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
                    
                    <div className="mt-4">
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          const eventUrl = event.slug ? `${window.location.origin}/events/${event.slug}` : `${window.location.origin}/events#event-${event.id}`;
                          navigator.clipboard.writeText(eventUrl);
                          alert('Event link copied to clipboard!');
                        }}
                      >
                        Copy Event Link
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={shareEvent}
            className="shrink-0"
            title="Share this event"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Events: React.FC = () => {
  // Handle scrolling to event on page load if hash exists
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        "price": !event.entry || event.entry === "Free" ? "0" : event.entry.replace("KES ", ""),
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