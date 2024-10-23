import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { people, times } from "@/utils/home";
import DatePicker from "react-datepicker";
import { CalendarIcon, ChevronDownIcon, ClockIcon, SearchIcon, UserIcon } from "lucide-react";
import { useState } from "react";


export default function FreeReservation() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <main className="pt-12">
      <div
        className="relative h-[320px] bg-cover bg-center"
        style={{ backgroundImage: `url('/images/Phototwo.jpg')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative container mx-auto px-4 py-20 text-white">
          <h3 className="text-6xl font-bold mb-8 text-center">Faça uma reserva grátis</h3>

          <div className="w-full max-w-3xl mx-auto space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Button variant="outline" className="flex-grow bg-white text-black h-10">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    dateFormat="dd MMM yyyy"
                    className="bg-transparent text-black w-full"
                    placeholderText="Selecione uma data"
                  />
                  <ChevronDownIcon className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1">
                <Select>
                  <SelectTrigger className="flex-grow bg-white text-black h-10">
                    <ClockIcon className="mr-2 h-5 w-5" />
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent className="">
                    {times.map((time) => (
                      <SelectItem key={time.value} value={String(time.value)}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select>
                  <SelectTrigger className="flex-grow bg-white text-black h-10">
                    <UserIcon className="mr-2 h-5 w-5" />
                    <SelectValue placeholder="Pessoas" />
                  </SelectTrigger>
                  <SelectContent>
                    {people.map((person) => (
                      <SelectItem key={person.value} value={String(person.value)}>
                        {person.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Restaurante"
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-white text-black h-10"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white flex-grow-0 w-40 h-10">
                Vamos lá
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}