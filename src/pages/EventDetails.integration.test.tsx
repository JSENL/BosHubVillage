import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import EventDetails from "./EventDetails";

const mockFrom = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/hooks/useEvents", () => ({
  useEvents: () => ({ events: [], loading: false }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: null, isAdmin: false }),
}));

vi.mock("@/hooks/useTranslatedField", () => ({
  useTranslatedField: () => ({ getTranslatedText: (value: string) => value }),
}));

vi.mock("@/hooks/useDocumentHead", () => ({
  useDocumentHead: () => undefined,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, arg?: string | Record<string, unknown>) =>
      typeof arg === "string" ? arg : key,
  }),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

vi.mock("@/components/Navigation", () => ({ Navigation: () => <div>navigation</div> }));
vi.mock("@/components/EventComments", () => ({ default: () => <div>comments</div> }));
vi.mock("@/components/SocialShare", () => ({ SocialShare: () => <div>share</div> }));
vi.mock("@/components/CalendarShare", () => ({ CalendarShare: () => <div>calendar</div> }));
vi.mock("@/components/EventRegistrationForm", () => ({
  EventRegistrationForm: () => <div>registration</div>,
}));
vi.mock("@/components/social/BookmarkButton", () => ({
  BookmarkButton: () => <button type="button">bookmark</button>,
}));
vi.mock("@/components/content/LinkedNewsSection", () => ({
  LinkedNewsSection: () => <div>linked-news</div>,
}));
vi.mock("@/components/events/EventCreatorInfo", () => ({
  EventCreatorInfo: () => <div>creator</div>,
}));
vi.mock("@/components/common/DetailPageLoading", () => ({
  DetailPageLoading: () => <div>loading</div>,
}));
vi.mock("@/components/events/EventHeroImageEditor", () => ({
  EventHeroImageEditor: () => <div>hero-editor</div>,
}));

const baseEventRow = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Who Are We? Photo Project",
  description: "Community photo exhibit.",
  category: "Art",
  event_type: "event",
  date: "2026-04-24",
  start_time: "10:00:00",
  end_time: "12:00:00",
  location: "Boston",
  address: "Boston, MA",
  price: 0,
  max_attendees: 50,
  is_recurring: false,
  recurring_pattern: null,
  registration_required: false,
  created_by: "22222222-2222-4222-8222-222222222222",
  latitude: null,
  longitude: null,
  neighborhoods: null,
  villages: null,
  is_sponsored: false,
  contact_type: null,
  contact_value: null,
  image_url: null,
  cover_zoom: 1,
  cover_focus_x: 50,
  cover_focus_y: 50,
  website_link: null,
};

function createQueryBuilders(options: {
  liveEventBySlug?: Record<string, unknown> | null;
  liveEventById?: Record<string, unknown> | null;
  pastEventById?: Record<string, unknown> | null;
  pastCandidates?: Record<string, unknown>[];
}) {
  mockFrom.mockImplementation((table: string) => {
    if (table === "events") {
      return {
        select: () => ({
          eq: (column: string) => ({
            maybeSingle: async () => ({
              data: column === "slug" ? options.liveEventBySlug ?? null : options.liveEventById ?? null,
              error: null,
            }),
          }),
        }),
      };
    }

    if (table === "past_events") {
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: options.pastEventById ?? null, error: null }),
          }),
          ilike: () => ({
            order: () => ({
              limit: async () => ({ data: options.pastCandidates ?? [], error: null }),
            }),
          }),
        }),
      };
    }

    throw new Error(`Unexpected table ${table}`);
  });
}

describe("EventDetails integration", () => {
  beforeEach(() => {
    mockFrom.mockReset();
    mockNavigate.mockReset();
  });

  it("loads event detail from slug URL even with fbclid query param", async () => {
    createQueryBuilders({
      liveEventBySlug: { ...baseEventRow, slug: "who-are-we-photo-project" },
    });

    render(
      <MemoryRouter initialEntries={["/event/who-are-we-photo-project?fbclid=test123"]}>
        <Routes>
          <Route path="/event/:eventSlug" element={<EventDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Who Are We? Photo Project" })).toBeInTheDocument();
    });
    expect(screen.getByText("4/24/2026 at 10:00 AM - 12:00 PM")).toBeInTheDocument();
  });

  it("loads archived events by slugified title fallback", async () => {
    createQueryBuilders({
      liveEventBySlug: null,
      pastEventById: null,
      pastCandidates: [{ ...baseEventRow, title: "Who Are We? Photo Project" }],
    });

    render(
      <MemoryRouter initialEntries={["/event/who-are-we-photo-project"]}>
        <Routes>
          <Route path="/event/:eventSlug" element={<EventDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Who Are We? Photo Project" })).toBeInTheDocument();
    });
  });

  it("redirects legacy UUID event links to canonical slug URL", async () => {
    createQueryBuilders({
      liveEventBySlug: null,
      liveEventById: { ...baseEventRow, slug: "who-are-we-photo-project" },
    });

    render(
      <MemoryRouter initialEntries={["/event/11111111-1111-4111-8111-111111111111"]}>
        <Routes>
          <Route path="/event/:eventSlug" element={<EventDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/event/who-are-we-photo-project", { replace: true });
    });

    expect(screen.getByRole("heading", { name: "Who Are We? Photo Project" })).toBeInTheDocument();
  });
});

