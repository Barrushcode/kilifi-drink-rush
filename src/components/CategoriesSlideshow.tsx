import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    id: 'whiskey',
    name: 'Whiskey',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Premium whiskeys from around the world'
  },
  {
    id: 'vodka',
    name: 'Vodka',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Crystal clear premium vodka'
  },
  {
    id: 'wine',
    name: 'Wine',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Fine wines for every occasion'
  },
  {
    id: 'beer',
    name: 'Beer',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Refreshing beers and lagers'
  },
  {
    id: 'rum',
    name: 'Rum',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Caribbean and spiced rums'
  },
  {
    id: 'gin',
    name: 'Gin',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Classic and botanical gins'
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
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-48 object-cover"
                      />
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