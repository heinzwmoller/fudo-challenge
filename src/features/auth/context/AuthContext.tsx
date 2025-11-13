import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  email: string;
  name: string;
  avatar: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => void;
  logout: () => void;
};

const STORAGE_KEY = "fudo-challenge:user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=6";

const getInitialUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as AuthUser;
  } catch (error) {
    console.warn("No se pudo recuperar el usuario almacenado", error);
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getInitialUser());

  const login = useCallback(
    ({ email }: { email: string; password: string }) => {
      const fallbackName = email.split("@")[0] || "Usuario";
      const normalizedName =
        fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);

      const authUser: AuthUser = {
        email,
        name: normalizedName || "Usuario",
        avatar: DEFAULT_AVATAR,
      };

      setUser(authUser);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de AuthProvider");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthUser = (): AuthUser | null => {
  const { user } = useAuth();
  return user;
};
