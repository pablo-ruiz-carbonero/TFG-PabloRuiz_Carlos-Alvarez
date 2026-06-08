// src/features/weather/hooks/useWeather.ts
// Acceso tipado al WeatherContext. Lanza un error si se usa fuera del provider.

import { useContext } from 'react';
import { WeatherContext } from '../context/weatherContext';

export const useWeather = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather debe usarse dentro de WeatherProvider');
  return ctx;
};