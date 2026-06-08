// Definiciones de tipos e interfaces compartidas en toda la aplicación AgroLink.

// Roles de usuario disponibles en la plataforma
export type UserRole = 'farmer' | 'distributor' | 'supplier' | 'admin';

// Representa al usuario autenticado en la sesión
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  token?: string;
}

// Estados posibles del ciclo de vida de un cultivo
export type CropStatus = 'growing' | 'harvested' | 'failed';

// Tipos de labor agrícola que se pueden registrar en un cultivo
export type ActivityType = 'irrigation' | 'fertilization' | 'harvest' | 'pest';

// Registro de una labor agrícola asociada a un cultivo concreto
export interface Activity {
  id: string;
  cropId: string;
  type: ActivityType;
  date: string;
  details: string;
  quantity?: number;
  unit?: string;
}

// Cultivo registrado por un agricultor, con su historial de actividades
export interface Crop {
  id: string;
  name: string;
  variety: string;
  soilType: string;
  area: number; // en hectáreas
  plantingDate: string;
  status: CropStatus;
  farmerId: string;
  activities: Activity[];
}

// Categorías de productos disponibles en el marketplace
export type ProductCategory = 'seeds' | 'machinery' | 'crops' | 'inputs';

// Anuncio publicado en el marketplace agrícola
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  image?: string;
  images?: string[];
  stock: number;
  unit: string; // p.ej. "kg", "unidades", "sacos", "toneladas"
  location: string;
  sellerId: string;
  sellerName: string;
  sellerRole: UserRole;
  createdAt: string;
}

// Mensaje individual dentro de una conversación entre dos usuarios
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Conversación entre el usuario actual y otro participante
export interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: UserRole;
  messages: Message[];
  lastMessage?: Message;
}

// Datos meteorológicos actuales y pronóstico de 5 días para una localización
export interface WeatherData {
  temp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  condition: string;
  forecast: {
    date: string;
    temp: number;
    description: string;
    icon: string;
  }[];
}
