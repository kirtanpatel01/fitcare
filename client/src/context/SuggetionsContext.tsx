import api from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface Extra {
  bonus_tip: string;
  motivation: string;
}

interface Exercise {
  name: string;
  reps_per_set: number;
  duration_seconds: number;
  sets: number;
  type: string;
}

interface Food {
  calories: number;
  name: string;
  qtyUnit: string;
  quantity: number;
  state: string;
  timing: string[];
  veg: boolean;
}

export interface Suggetion {
  extra: Extra;
  exercise: Exercise[];
  food: Food[];
}

interface SuggetionContext {
  suggetions: Suggetion | null;
  isLoading: boolean;
}

const SuggetionsContex = createContext<SuggetionContext | undefined>(undefined);

const LOCAL_STORAGE_KEY = "fitcare-suggestions";

export const SuggetionProvider = ({ children }: { children: React.ReactNode }) => {
  const [suggetions, setSuggetions] = useState<Suggetion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const getAllSuggetions = async () => {
      try {
        setIsLoading(true);

        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        const now = Date.now();

        if (cached) {
          const parsed = JSON.parse(cached) as {
            data: Suggetion;
            timestamp: number;
          };

          const ONE_DAY = 24 * 60 * 60 * 1000;

          // Use cached version if it's not older than 24h
          if (now - parsed.timestamp < ONE_DAY) {
            setSuggetions(parsed.data);
            return;
          }
        }

        const res = await api.get("/profile/suggetions");
        if (res.status === 200) {
          const fetched = res.data.parsed;
          // toast.success("Suggestions fetched from API.");

          // Update state and cache
          setSuggetions(fetched);
          localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({
              data: fetched,
              timestamp: now,
            })
          );
        }
      } catch (error: any) {
        console.error("Error while fetching suggestions:", error);
        toast.error("Failed to fetch suggestions.");
      } finally {
        setIsLoading(false);
      }
    };

    if(isAuthenticated && !suggetions) getAllSuggetions();
  }, [isAuthenticated, suggetions]);

  return (
    <SuggetionsContex.Provider value={{ suggetions, isLoading }}>
      {children}
    </SuggetionsContex.Provider>
  );
};

export const useSuggetion = () => {
  const context = useContext(SuggetionsContex);
  if (!context) throw new Error("useSuggetion must be used within SuggetionProvider");
  return context;
};
