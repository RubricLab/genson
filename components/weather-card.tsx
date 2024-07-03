"use client"

import type { rubricSchema } from "@/app/action/schema";
import type { z } from "zod";
import { useAtomValue } from "jotai";
import dataStore from "../lib/store";

export default function WeatherCard(
  info: z.infer<typeof rubricSchema.components.weatherCard>
) {
  const data = useAtomValue(dataStore);

  function getRandomWeather(city: string) {
    const weatherTypes = ["Sunny", "Cloudy", "Rainy", "Snowy", "Windy"];
    const cityHash = Array.from(city).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomIndex = cityHash % weatherTypes.length;
    const randomTemperature = cityHash % 40; // Consistent temperature between 0 and 40 based on city name
    const randomHigh = randomTemperature + (cityHash % 5);
    const randomLow = randomTemperature - (cityHash % 5);

    return {
      city,
      temperature: randomTemperature,
      high: randomHigh,
      low: randomLow,
      weatherType: weatherTypes[randomIndex],
    };
  }

  const randomWeather = getRandomWeather(data[info.getterValue as string] ?? info.city);

  const weatherData = randomWeather || info;

  return (
    <div className="flex flex-col justify-between w-64 h-64 rounded-2xl p-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-primary-foreground">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg">{data[info.getterValue as string] ?? ""}</h1>
          <p className="text-6xl">{weatherData.temperature}°</p>
        </div>
      </div>
      <div className="flex flex-col">
        <SunIcon className="text-yellow-300 text-2xl" />
        <span className="text-sm">{weatherData.weatherType}</span>
        <div className="text-sm">
          <span>H:{weatherData.high}° </span>
          <span>L:{weatherData.low}°</span>
        </div>
      </div>
    </div>
  );
}
function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Sun</title>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
