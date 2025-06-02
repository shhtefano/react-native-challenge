import { supabase } from "./supabase";

export type Event = {
  id: string;
  created_at: string;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  date: string;
  owner_id: string;
  max_guests: number;
  booked_count: number;
};

// 1️⃣ Ottieni tutti gli eventi
export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Errore nel recupero eventi:', error.message);
    throw error;
  }
  console.log('Log.info: GET request for events', data);
  return data as Event[];
}

// 2️⃣ Prenota un evento (inserisce nella tabella bookings)
export async function bookEvent(eventId: string, mail: string): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log(mail);
  if (!mail || mail === '') throw new Error('Utente non autenticato');

  // 1. Controlla se l’utente ha già prenotato
  const { data: existing, error: checkError } = await supabase
    .from('bookings')
    .select('id')
    .eq('event_id', eventId)
    .eq('mail', mail);

  if (checkError) throw checkError;
  if (existing && existing.length > 0) {
    throw new Error('Hai già prenotato questo evento');
  }

  // 2. Controlla se ci sono ancora posti disponibili
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('booked_count, max_guests')
    .eq('id', eventId)
    .single();

  if (eventError) throw eventError;

  if (event.booked_count >= event.max_guests) {
    throw new Error('Posti esauriti per questo evento');
  }

  // 3. Inserisci la prenotazione
  const { error: insertError } = await supabase
    .from('bookings')
    .insert([{ event_id: eventId, mail, created_at: new Date().toISOString() }]);

  if (insertError) {
    console.error('Errore nella prenotazione:', insertError.message);
    throw insertError;
  }

  // 4. Incrementa booked_count manualmente
  const { error: updateError } = await supabase
    .from('events')
    .update({ booked_count: event.booked_count + 1 })
    .eq('id', eventId);

  if (updateError) {
    console.error('Errore nell’aggiornamento booked_count:', updateError.message);
    throw updateError;
  }
}


// 3️⃣ Conta le prenotazioni attive di un utente (es. per un badge nella navbar)
export async function getActiveBookingsCount(): Promise<number> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;
  if (!userId) return 0;

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      event:events(date)
    `)
    .eq('user_id', userId)
    .gte('event.date', now); // solo eventi futuri

  if (error) {
    console.error('Errore nel conteggio prenotazioni attive:', error.message);
    return 0;
  }

  return data.length;
}

export async function getBookingsByMail(mail: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      event:events(*)
    `)
    .eq('mail', mail);

  if (error) {
    console.error('Errore nel recupero prenotazioni:', error.message);
    throw error;
  }

  return (data as any[]).map((booking) => booking.event as Event);
}


export async function cancelBooking(eventId: string, mail: string): Promise<void> {
  // Step 1: Rimuovi la prenotazione dalla tabella `bookings`
  const { error: deleteError } = await supabase
    .from('bookings')
    .delete()
    .eq('event_id', eventId)
    .eq('mail', mail);

  if (deleteError) {
    console.error('Errore durante la disdetta:', deleteError.message);
    throw deleteError;
  }

  // Step 2: Decrementa booked_count nella tabella `events`
  const { data: eventData, error: fetchError } = await supabase
    .from('events')
    .select('booked_count')
    .eq('id', eventId)
    .single();

  if (fetchError) {
    console.error('Errore nel recupero del count:', fetchError.message);
    throw fetchError;
  }

  const newCount = Math.max(0, (eventData?.booked_count ?? 1) - 1);

  const { error: updateError } = await supabase
    .from('events')
    .update({ booked_count: newCount })
    .eq('id', eventId);

  if (updateError) {
    console.error('Errore nell\'aggiornamento di booked_count:', updateError.message);
    throw updateError;
  }
}
