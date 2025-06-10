'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type UserConfig = {
  name: string;
  email: string;
  storeType: string;
  country: string;
  currency: string;
  deliveryProfile: string;
  productProfile: string;
  goalFocus: string;
};

type UserContextType = {
  userConfig: UserConfig | null;
  setUserConfig: (config: UserConfig) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);

  return (
    <UserContext.Provider value={{ userConfig, setUserConfig }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserContext must be used inside UserProvider');
  return context;
}
