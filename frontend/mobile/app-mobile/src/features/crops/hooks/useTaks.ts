// src/features/tasks/hooks/useTasks.ts
// Hook legacy de creacion de tareas. La lógica está centralizada en
// CropsContext.addTask; este archivo se mantiene por compatibilidad.

import { createTaskRequest } from "../api/tasksApi";

export const useTasks = () => {

  // Llama directamente al endpoint sin pasar por el contexto global
  const createTask = async (data: any) => {
    return await createTaskRequest(data);
  };

  return { createTask };
};