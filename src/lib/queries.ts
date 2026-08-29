import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type Banner = Database["public"]["Tables"]["banners"]["Row"];

/** Leaderboard COMPLETO: puja desc, luego antigüedad desc. */
export async function fetchLeaderboard(category: string, zone?: string | null) {
  let q = supabase
    .from("properties")
    .select("*")
    .eq("category", category)
    .eq("active", true)
    .order("bid_amount", { ascending: false })
    .order("created_at", { ascending: false });
  if (zone) q = q.eq("zone", zone);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function fetchPropertyBySlug(slug: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchBanners(category?: string | null, zone?: string | null) {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).filter(
    (b) => (!b.category || b.category === category) && (!b.zone || b.zone === zone),
  );
}

export async function fetchMyProperties(userId: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("bid_amount", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Posición del prestador dentro de su categoría+zona (solo activos). */
export async function fetchRanking(property: Property) {
  const list = await fetchLeaderboard(property.category, property.zone);
  const pos = list.findIndex((p) => p.id === property.id) + 1;
  const topBid = list.length ? Number(list[0]!.bid_amount) : 0;
  return { pos, total: list.length, topBid };
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
