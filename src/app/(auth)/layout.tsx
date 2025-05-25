import Link from "next/link";
import "reflect-metadata"


export default async function AuthorizedLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="bg-gray-800 shadow-gray-800/20 w-full px-5 py-2">
        <div className={`flex w-full  items-center container py-`}>
          <nav className="grow flex list-none max-sm:flex-col items-center">
            <div className="text-3xl font-bold text-white mr-10">
              <Link href="/">MD2PDF</Link>
            </div>
          </nav>
        </div>
      </div>
      {children}
    </>
  );
}
