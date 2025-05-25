import "reflect-metadata"

import { container } from "tsyringe";
import { ClientProvider as UserInfoProvider, UserInfoContext } from "./user-info-provider";
import UserService from "../../domain/user/user.service";
import Header from "../components/layout/header";

const userService = container.resolve(UserService);

export default async function AuthorizedLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await userService.getCurrentUserOrRedirectToAuth();
  console.log("UserInfoContext:", UserInfoContext);
  console.log("UserInfoContext.Provider:", UserInfoContext?.Provider);
  return (
    <>
      <UserInfoProvider user={{ id: user.getId(), username: user.getUsername() }}>
        <Header />
        {children}
      </UserInfoProvider>
    </>
  );
}
