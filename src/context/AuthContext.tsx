import type { User } from "@supabase/supabase-js"; 

import { createContext } from "react";

interface AuthContextType {
  user: User | null;
  signInWithGitHub: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
