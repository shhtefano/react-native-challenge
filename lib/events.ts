import { supabase } from "./supabase";

export async function getEvents() {
  console.log("Log.info: GET request for events");

  const { data, error } = await supabase.from("events").select("*");
  if (error) throw error;
  return data;
}

export async function createEvent(event: {
  title: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  date?: string;
  owner_id?: string;
}) {
  console.log("Log.info: POST request for events");
  const { error } = await supabase.from("events").insert([event]);
  if (error) throw error;
}