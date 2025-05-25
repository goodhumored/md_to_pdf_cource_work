"use client"

import React, { ReactNode } from "react";

export const UserInfoContext = React.createContext<{ username: string, id: number | undefined } | null>(null);

export function ClientProvider({
  children,
  user
}: {
  children: ReactNode | ReactNode[];
  user: { id: number | undefined; username: string };
}) {
  return (
    <UserInfoContext.Provider value={{ id: user.id, username: user.username }}>
      {children}
    </UserInfoContext.Provider>
  );
}

export function useUserInfo() {
  const context = React.useContext(UserInfoContext);
  if (!context) {
    throw new Error('useUserInfo must be used within a UserInfoContext');
  }
  return context;
}
