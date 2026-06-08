/// <reference types="vite/client" />
// Servicio CRUD para cultivos y sus actividades agrícolas, con mapeo bidireccional entre el modelo del backend y el modelo web.
import { api } from './api';
import { dbService } from './mockDb';
import { Crop, Activity, ActivityType, CropStatus } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ── Mappers backend → web ──────────────────────────────────────────────────────

// Traduce el tipo de tarea del backend (en español) al tipo de actividad del frontend
const TAREA_TO_ACTIVITY: Record<string, ActivityType> = {
  riego: 'irrigation',
  fertilizacion: 'fertilization',
  cosecha: 'harvest',
  plaguicida: 'pest',
  siembra: 'pest',
};

// Convierte el estado del cultivo recibido del backend al enum interno
function mapStatus(s?: string): CropStatus {
  if (s === 'completed' || s === 'harvested') return 'harvested';
  if (s === 'archived' || s === 'failed') return 'failed';
  return 'growing';
}

// Convierte el estado interno del frontend al valor que espera el backend
function mapStatusToBackend(s: CropStatus): string {
  if (s === 'harvested') return 'completed';
  if (s === 'failed') return 'archived';
  return 'active';
}

function backendTaskToActivity(task: any, cropId: string): Activity {
  return {
    id: task.id?.toString() ?? '',
    cropId,
    type: TAREA_TO_ACTIVITY[task.tipo] ?? 'pest',
    date: task.fecha?.toString() ?? '',
    details: task.descripcion ?? '',
    quantity: task.cantidad != null ? parseFloat(task.cantidad) : undefined,
    unit: task.unidad ?? undefined,
  };
}

function backendCropToWeb(raw: any): Crop {
  const cropId = raw.id?.toString() ?? '';
  return {
    id: cropId,
    name: raw.nombre ?? '',
    variety: raw.variedad ?? '',
    soilType: raw.tipo_cultivo ?? '',
    area: parseFloat(raw.superficie) || 0,
    plantingDate: raw.fecha_siembra?.toString() ?? '',
    status: mapStatus(raw.status),
    farmerId: raw.usuario?.id?.toString() ?? '',
    activities: Array.isArray(raw.tareas)
      ? raw.tareas.map((t: any) => backendTaskToActivity(t, cropId))
      : [],
  };
}

function webCropToBackend(data: Omit<Crop, 'id' | 'activities'>): Record<string, any> {
  return {
    nombre: data.name,
    variedad: data.variety,
    tipo_cultivo: data.soilType,
    superficie: data.area,
    fecha_siembra: data.plantingDate,
  };
}

// Genera solo los campos modificados para un PATCH parcial al backend
function webCropUpdateToBackend(data: Partial<Crop>): Record<string, any> {
  const result: Record<string, any> = {};
  if (data.name !== undefined) result.nombre = data.name;
  if (data.variety !== undefined) result.variedad = data.variety;
  if (data.soilType !== undefined) result.tipo_cultivo = data.soilType;
  if (data.area !== undefined) result.superficie = data.area;
  if (data.plantingDate !== undefined) result.fecha_siembra = data.plantingDate;
  if (data.status !== undefined) result.status = mapStatusToBackend(data.status);
  return result;
}

// ── Servicio ───────────────────────────────────────────────────────────────────

export const cropService = {
  getCrops: async (farmerId: string): Promise<Crop[]> => {
    if (USE_MOCK) {
      await delay(400);
      return dbService.getCrops(farmerId);
    }
    const raw = await api.get('/crops');
    return (raw ?? []).map(backendCropToWeb);
  },

  getAllCrops: async (): Promise<Crop[]> => {
    if (USE_MOCK) {
      await delay(400);
      return dbService.getAllCrops();
    }
    const raw = await api.get('/crops');
    return (raw ?? []).map(backendCropToWeb);
  },

  addCrop: async (cropData: Omit<Crop, 'id' | 'activities'>): Promise<Crop> => {
    if (USE_MOCK) {
      await delay(500);
      return dbService.addCrop(cropData);
    }
    const raw = await api.post('/crops', webCropToBackend(cropData));
    return backendCropToWeb(raw);
  },

  updateCrop: async (cropId: string, updated: Partial<Crop>): Promise<Crop> => {
    if (USE_MOCK) {
      await delay(400);
      return dbService.updateCrop(cropId, updated);
    }
    const raw = await api.patch(`/crops/${cropId}`, webCropUpdateToBackend(updated));
    return backendCropToWeb(raw);
  },

  deleteCrop: async (cropId: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(400);
      return dbService.deleteCrop(cropId);
    }
    await api.delete(`/crops/${cropId}`);
  },

  addActivity: async (cropId: string, activityData: Omit<Activity, 'id' | 'cropId'>): Promise<Activity> => {
    if (USE_MOCK) {
      await delay(300);
      return dbService.addActivity(cropId, activityData);
    }
    // Backend returns taskToActivity format, which already matches Activity type
    const raw = await api.post(`/crops/${cropId}/activities`, {
      type: activityData.type,
      date: activityData.date,
      details: activityData.details,
      quantity: activityData.quantity,
      unit: activityData.unit,
    });
    return raw as Activity;
  },

  deleteActivity: async (cropId: string, activityId: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(300);
      return dbService.deleteActivity(cropId, activityId);
    }
    await api.delete(`/crops/${cropId}/activities/${activityId}`);
  },
};
