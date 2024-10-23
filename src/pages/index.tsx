import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { StarIcon, MapPinIcon, CircleDollarSign, MessageCircleCode, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import AppLayout from "@/components/layout/_app-layout";
import FreeReservation from "@/components/free-reservation";
import router from "next/router";

type Restaurant = {
  place_id: string;
  name: string;
  rating: number;
  price_level: number;
  types: string[];
  formatted_address: string;
  photos?: { photo_reference: string }[];
  user_ratings_total: number;
};

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [visibleCards, setVisibleCards] = useState(1);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const fetchRestaurants = async (pageToken?: string) => {
    setIsLoading(true);
    let url = '/api/restaurants';

    if (pageToken) {
      url += `?pagetoken=${pageToken}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      setRestaurants((prevRestaurants) => [...prevRestaurants, ...data.results]);
      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error("Erro ao buscar restaurantes: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1280) {
        setVisibleCards(5);
      } else if (window.innerWidth >= 1280) {
        setVisibleCards(4);
      } else if (window.innerWidth >= 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollPrev(scrollLeft > 0);
      setCanScrollNext(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center">
      <StarIcon className="h-5 w-5 text-yellow-500" />
      <span className="ml-1 text-md text-gray-800">{rating.toFixed(1)}</span>
    </div>
  );

  const renderPriceLevel = (priceLevel?: number) => {
    if (priceLevel === undefined || priceLevel === null) {
      return <div className="text-black text-md font-semibold">Não identificado</div>;
    }

    const maxDollars = 5;
    const dollars = [];

    for (let i = 0; i < maxDollars; i++) {
      dollars.push(
        <CircleDollarSign
          key={i}
          className={`h-5 w-5 ${i < priceLevel ? "text-green-500" : "text-gray-300"}`}
        />
      );
    }

    return <div className="flex justify-center">{dollars}</div>;
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / visibleCards;
      carouselRef.current.scrollBy({
        left: cardWidth * visibleCards,
        behavior: "smooth",
      });
      setTimeout(updateScrollButtons, 300);
    }
  };

  const scrollPrev = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / visibleCards;
      carouselRef.current.scrollBy({
        left: -cardWidth * visibleCards,
        behavior: "smooth",
      });
      setTimeout(updateScrollButtons, 300);
    }
  };

  useEffect(() => {
    updateScrollButtons();
  }, [restaurants]);

  const goToRestaurantDetails = (placeId: string) => {
    router.push(`/restaurant/${placeId}`);
  };

  return (
    <AppLayout>
      <FreeReservation />
      <div className="p-5">
        <div className="-mb-5">
          <h1 className="text-2xl font-extrabold">Opções do Rio de Janeiro</h1>
        </div>
        <div className="flex justify-center p-5">
          <Carousel className="w-full">
            <div className="flex flex-grow">
              <CarouselContent ref={carouselRef} className="flex overflow-x-auto snap-x snap-mandatory p-2 justify-center">
                {restaurants.map((restaurant) => (
                  <CarouselItem
                    key={restaurant.place_id}
                    className="snap-center"
                    style={{ flexBasis: `${100 / visibleCards}%`, flexShrink: 0 }}
                  >
                    <div className="p-2">
                      <Card className="hover:scale-105 transition-transform h-full">
                        <CardHeader className="p-0">
                          <img
                            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photos?.[0]?.photo_reference}&key=${API_KEY}`}
                            alt={restaurant.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col items-start justify-between h-full">
                          <CardTitle className="text-lg font-bold truncate w-full text-center">{restaurant.name}</CardTitle>
                          <div className="mt-1 flex items-center justify-start gap-2">
                            <span className="flex justify-center items-center gap-1">Avaliações: {restaurant.user_ratings_total} | </span> {renderStars(restaurant.rating)}
                          </div>
                          <div className="mt-1 flex items-center justify-start gap-2">
                            <span className="">Preço:</span>{renderPriceLevel(restaurant.price_level)}
                          </div>
                          <div className="flex items-center text-gray-600 text-sm mt-3">
                            <MapPinIcon className="h-7 w-7 mr-1" />
                            {restaurant.formatted_address}
                          </div>
                        </CardContent>
                        <div className="flex justify-center p-4">
                          <Button onClick={() => goToRestaurantDetails(restaurant.place_id)} className="bg-red-600 hover:bg-red-700">Reservar Mesa</Button>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious onClick={scrollPrev} disabled={!canScrollPrev} />
              <CarouselNext onClick={scrollNext} disabled={!canScrollNext} />
            </div>
          </Carousel>
        </div>
      </div>
    </AppLayout>
  );
}