export const CATEGORIES = [
  { value: "hostal", label: "Hostales", plural: "hostales", path: "/hostales" },
  { value: "taxi", label: "Taxis", plural: "taxis", path: "/taxis" },
  { value: "restaurante", label: "Restaurantes", plural: "restaurantes", path: "/restaurantes" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export const ZONES = [
  { value: "vedado", label: "Vedado" },
  { value: "centro", label: "Centro Habana" },
  { value: "habana-vieja", label: "Habana Vieja" },
  { value: "playa", label: "Playa / Miramar" },
  { value: "varadero", label: "Varadero" },
  { value: "trinidad", label: "Trinidad" },
  { value: "vinales", label: "Viñales" },
] as const;

export type ZoneValue = (typeof ZONES)[number]["value"];

/** WhatsApp del administrador de ToenCuba (pagos manuales y validaciones). */
export const ADMIN_WHATSAPP = "5350000000";

export const zoneLabel = (value?: string | null) =>
  ZONES.find((z) => z.value === value)?.label ?? value ?? "";

export const categoryLabel = (value?: string | null) =>
  CATEGORIES.find((c) => c.value === value)?.label ?? value ?? "";

export const categoryByValue = (value: string) => CATEGORIES.find((c) => c.value === value);

export function waLink(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

/** Optimización de imágenes: si es Cloudinary aplica w_/q_auto, si no devuelve tal cual. */
export function optimizedImage(url: string | null | undefined, width = 800) {
  if (!url) return "";
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
}
