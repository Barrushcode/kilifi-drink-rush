import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

const categories = [
  {
    id: 'whiskey',
    name: 'Whiskey',
    image: 'https://tyfsxboxshbkdetweuke.supabase.co/storage/v1/object/public/pictures/JOHNNIE%20WALKER%20BLACK%20-750ML.jpeg',
    description: 'Premium whiskeys from around the world'
  },
  {
    id: 'vodka',
    name: 'Vodka',
    image: 'https://tyfsxboxshbkdetweuke.supabase.co/storage/v1/object/public/pictures/GREY%20GOOSE%20VODKA%20750ML.jfif',
    description: 'Crystal clear premium vodka'
  },
  {
    id: 'wine',
    name: 'Wine',
    image: 'https://tyfsxboxshbkdetweuke.supabase.co/storage/v1/object/public/pictures/MOET%20%26CHANDON%20IMPERIAL%20BRUT%20750ML.jpeg',
    description: 'Fine wines and champagnes'
  },
  {
    id: 'beer',
    name: 'Beer',
    image: 'https://tyfsxboxshbkdetweuke.supabase.co/storage/v1/object/public/pictures/HUNTERS%20GOLD%20CIDER%206%20PACK%20330ML%20CANS.jfif',
    description: 'Refreshing beers and premium ciders'
  },
  {
    id: 'rum',
    name: 'Rum',
    image: 'https://tyfsxboxshbkdetweuke.supabase.co/storage/v1/object/public/pictures/CAPTAIN%20MORGAN%20SPICED%20GOLD-1ltr.jpg',
    description: 'Caribbean and spiced rums'
  },
  {
    id: 'gin',
    name: 'Gin',
    image: 'https://tyfsxboxshbkdetweuke.supabase.co/storage/v1/object/public/pictures/BEEFEATER%2024%20PREMIUM%20GIN%20750ML.jpg',
    description: 'Premium botanical gins'
  }
];

const CategoriesSlideshow: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <section className="py-20 bg-barrush-midnight">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-6">
            Browse Categories
          </h2>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Discover our premium selection of spirits and beverages
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories.map((category) => (
              <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card 
                  className="bg-barrush-charcoal/80 border-barrush-steel/30 hover:border-rose-500/50 transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-lg">
                      <AspectRatio ratio={4/3}>
                        <OptimizedImage
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full rounded-lg"
                          priority={false}
                        />
                      </AspectRatio>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-zinc-50 mb-2">
                          {category.name}
                        </h3>
                        <p className="text-zinc-300 text-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-barrush-charcoal/80 border-barrush-steel/30 text-zinc-50 hover:bg-rose-500/20" />
          <CarouselNext className="bg-barrush-charcoal/80 border-barrush-steel/30 text-zinc-50 hover:bg-rose-500/20" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoriesSlideshow;