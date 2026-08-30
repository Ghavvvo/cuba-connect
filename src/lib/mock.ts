/** Datos mock para la UI (sin backend). */
export type MockProperty = {
  id: string;
  name: string;
  slug: string;
  category: string;
  zone: string;
  whatsapp: string;
  bid_amount: number;
  subdomain: string | null;
  active: boolean;
  views: number;
  clicks: number;
  created_at: string;
};

export const MOCK_PROPERTIES: MockProperty[] = [
  {
    id: "1",
    name: "Hostal Villa D2",
    slug: "hostal-villa-d2",
    category: "hostal",
    zone: "vedado",
    whatsapp: "5350000001",
    bid_amount: 120,
    subdomain: "villad2",
    active: true,
    views: 1840,
    clicks: 212,
    created_at: "2026-01-12T10:00:00Z",
  },
  {
    id: "2",
    name: "Casa Marta",
    slug: "casa-marta",
    category: "hostal",
    zone: "centro",
    whatsapp: "5350000002",
    bid_amount: 75,
    subdomain: null,
    active: true,
    views: 940,
    clicks: 96,
    created_at: "2026-02-02T10:00:00Z",
  },
  {
    id: "3",
    name: "Taxi Clásico Yoandry",
    slug: "taxi-clasico-yoandry",
    category: "taxi",
    zone: "habana-vieja",
    whatsapp: "5350000003",
    bid_amount: 40,
    subdomain: null,
    active: true,
    views: 610,
    clicks: 88,
    created_at: "2026-02-20T10:00:00Z",
  },
  {
    id: "4",
    name: "Paladar La Guarida Chica",
    slug: "paladar-la-guarida-chica",
    category: "restaurante",
    zone: "centro",
    whatsapp: "5350000004",
    bid_amount: 0,
    subdomain: null,
    active: false,
    views: 120,
    clicks: 9,
    created_at: "2026-03-05T10:00:00Z",
  },
];

export const MOCK_BANNERS = [
  {
    id: "b1",
    image_url: "",
    category: "hostal",
    zone: "vedado",
    target_url: "https://toencuba.app",
    position: "top",
    active: true,
  },
  {
    id: "b2",
    image_url: "",
    category: null,
    zone: null,
    target_url: "https://toencuba.app",
    position: "between",
    active: false,
  },
];

/** Propiedad del prestador demo + su ranking calculado sobre los mocks. */
export const MOCK_MY_PROPERTY = MOCK_PROPERTIES[0]!;

export function mockRanking(p: MockProperty) {
  const list = MOCK_PROPERTIES.filter(
    (x) => x.category === p.category && x.zone === p.zone && x.active,
  ).sort((a, b) => b.bid_amount - a.bid_amount);
  const sameCategory = MOCK_PROPERTIES.filter((x) => x.category === p.category && x.active).sort(
    (a, b) => b.bid_amount - a.bid_amount,
  );
  const base = list.length > 1 ? list : sameCategory;
  return {
    pos: base.findIndex((x) => x.id === p.id) + 1,
    total: base.length,
    topBid: base.length ? base[0]!.bid_amount : 0,
  };
}
