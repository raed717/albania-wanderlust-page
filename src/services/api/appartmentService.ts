import { apiClient } from "./apiClient";
import { Appartment, CreateAppartmentDto, UpdateAppartmentDto } from "@/types/appartment.type";

/**
 * fetch all appatments
 */
export const getAllAppartments = async (): Promise<Appartment[]> => {
    const { data, error } = await apiClient.from("appartment").select("*");
    if (error) throw error;
    return data;
};

/**
 * fetch appartments by provider ID
 */
export const getAppartmentsByProviderId = async (providerId: string): Promise<Appartment[]> => {
    const { data, error } = await apiClient
        .from("appartment")
        .select("*")
        .eq("providerId", providerId);
    if (error) throw error;
    return data;
};

/**
 * fetch a single appartment by ID
 */
export const getAppartmentById = async (id: number): Promise<Appartment | null> => {
    const { data, error } = await apiClient
        .from("appartment")
        .select("*")
        .eq("id", id)
        .single();
    if (error) throw error;
    return data;
}
 /*
 * create a new appartment
 */
export const createAppartment = async (data: CreateAppartmentDto): Promise<Appartment> => {
    const { data: newAppartment, error } = await apiClient
        .from("appartment")
        .insert([data])
        .select()
        .single();
    if (error) throw error;
    return newAppartment;
};

/**
 * update an existing appartment
 */
export const updateAppartment = async (id: number, updates: UpdateAppartmentDto): Promise<Appartment> => {
    const { data, error } = await apiClient
        .from("appartment")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
    if (error) throw error;
    return data;
};

/**
 * delete an appartment
 */
export const deleteAppartment = async (id: number): Promise<void> => {
    const { error } = await apiClient
        .from("appartment")
        .delete()
        .eq("id", id);
    if (error) throw error;
};


const appartmentService = {
    getAllAppartments,
    getAppartmentById,
    createAppartment,
    updateAppartment,
    deleteAppartment,
};

export default appartmentService;