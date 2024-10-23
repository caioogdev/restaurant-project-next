import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarIcon, CircleDollarSign, PhoneIcon, GlobeIcon } from "lucide-react";
import AppLayout from '@/components/layout/_app-layout';
import { times, people } from '@/utils/home';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

type Review = {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
};

type Restaurant = {
  name: string;
  rating: number;
  vicinity: string;
  price_level: number;
  photos?: { photo_reference: string }[];
  user_ratings_total: number;
  formatted_address: string;
  formatted_phone_number: string;
  website: string;
  reviews: Review[];
};

export default function RestaurantDetails() {
  const router = useRouter();
  const { place_id } = router.query;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false)

  const displayedPhotos = restaurant?.photos.slice(0, 5);
  const remainingPhotos = restaurant?.photos.slice(5);


  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (place_id) {
      const fetchRestaurantDetails = async () => {
        try {
          const response = await fetch(`/api/restaurant/${place_id}`);
          const data = await response.json();
          setRestaurant(data.result);
        } catch (error) {
          console.error("Erro ao buscar detalhes do restaurante: ", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRestaurantDetails();
    }
  }, [place_id]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!restaurant) {
    return <div>Detalhes do restaurante não encontrados.</div>;
  }

  return (
    <AppLayout>
      <div className="relative mt-16">
        <img
          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${restaurant.photos[0].photo_reference}&key=${API_KEY}`}
          alt={restaurant.name}
          className="w-full h-[30rem] object-cover"
        />
        <div className="absolute bottom-0 left-0 p-4 m-1 bg-black/40 backdrop-blur-sm rounded-xl">
          <h1 className="text-3xl font-bold text-white">{restaurant.name}</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Tabs section */}
          <div className="col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="flex space-x-2">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                <TabsTrigger value="photos">Fotos</TabsTrigger>
              </TabsList>

              {/* Conteúdo da aba Visão Geral */}
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Sobre {restaurant.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-2 text-gray-600">{restaurant.formatted_address}</div>
                    <div className="flex items-center space-x-2 mt-4">
                      <StarIcon className="h-6 w-6 text-yellow-500" />
                      <span className="text-lg">{restaurant.rating.toFixed(1)} ({restaurant.user_ratings_total} avaliações)</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      {Array(restaurant.price_level).fill(0).map((_, i) => (
                        <CircleDollarSign key={i} className="h-5 w-5 text-green-500" />
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <PhoneIcon className="h-5 w-5" />
                      <span>{restaurant.formatted_phone_number}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <GlobeIcon className="h-5 w-5" />
                      <a href={restaurant.website} target="_blank" className="text-blue-600 hover:underline">
                        Website
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Conteúdo da aba Avaliações */}
              <TabsContent value="reviews">
                <Card className='max-h-[50rem] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400'>
                  <CardContent className='p-2'>
                    {restaurant.reviews && restaurant.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {restaurant.reviews.map((review, index) => (
                          <div key={index} className="flex space-x-4">
                            <img
                              src={review.profile_photo_url}
                              alt={review.author_name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <h3 className="font-semibold">{review.author_name}</h3>
                              <div className="flex flex-col items-start space-x-1">
                                <span className="text-gray-500 text-sm">
                                  {review.relative_time_description}
                                </span>
                                <span className='flex justify-center items-center gap-1'><StarIcon className="h-4 w-4 text-yellow-500" />{review.rating}</span>
                              </div>
                              <p className="mt-1 text-gray-600">{review.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Nenhuma avaliação disponível.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Conteúdo da aba Fotos */}
              <TabsContent value="photos">
                <Card>
                  <CardHeader>
                    <CardTitle>Fotos de {restaurant.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-3">
                      {displayedPhotos?.map((photo, index) => (
                        <div key={index} className={index === 0 ? "col-span-2 row-span-2" : ""}>
                          <img
                            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${API_KEY}`}
                            alt={`Foto ${index + 1} de ${restaurant.name}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                      {remainingPhotos.length > 0 && (
                        <Drawer open={open} onOpenChange={setOpen}>
                          <DrawerTrigger asChild>
                            <div className="relative cursor-pointer col-start-4 row-start-2">
                              <img
                                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${remainingPhotos[0].photo_reference}&key=${API_KEY}`}
                                alt={`Foto adicional de ${restaurant.name}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                <span className="text-white text-lg font-bold">+{remainingPhotos.length} More</span>
                              </div>
                            </div>
                          </DrawerTrigger>
                          <DrawerContent>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[80vh] overflow-y-auto">
                              {restaurant.photos.map((photo, index) => (
                                <img
                                  key={index}
                                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${API_KEY}`}
                                  alt={`Foto ${index + 1} de ${restaurant.name}`}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          </DrawerContent>
                        </Drawer>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Reservation Info */}
          <div className="col-span-2">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Reserve uma Mesa</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data</label>
                  <Input type="date" placeholder="Select date" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Horário</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {times.map((time) => (
                        <SelectItem key={time.value} value={time.value}>{time.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantidade de pessoas</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a quantidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {people.map((size) => (
                        <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md">
                  Reservar
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}