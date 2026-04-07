import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { api } from "../api";
import { Profile, Settings } from "../types";
import { getTelegramProfile } from "../utils/telegram";

interface AppDataContextValue {
  profile: Profile | null;
  settings: Settings | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const nextProfile = await getTelegramProfile();
    setProfile(nextProfile);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const [headerSettings] = await Promise.all([api.getSettings(), refreshProfile()]);
        setSettings(headerSettings);
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      profile,
      settings,
      loading,
      refreshProfile
    }),
    [loading, profile, refreshProfile, settings]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
}
