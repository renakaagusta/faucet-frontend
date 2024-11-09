import useCurrentTheme from "@/hooks/styles/theme";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { Button } from "../button/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "../sheet/sheet";

const Header = () => {
  const { setTheme } = useTheme();

  const currentTheme = useCurrentTheme();

  const { connectors, connect } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const links = [
    {
      destination: "/",
      label: "Home",
    },
    {
      destination: "/faucet",
      label: "Faucet",
    },
    {
      destination: "/",
      label: "Portfolio",
    },
    {
      destination: "/",
      label: "Dex",
    },
  ];

  const changeTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="bg-white/80 dark:bg-black/50 backdrop-blur-sm fixed w-full border-solid border-b-2 border-gray-100 dark:border-gray-900 flex flex-row justify-between items-center py-2 px-2 lg:px-[15vw]">
      <div className="flex flex-row gap-2">
        <p className="text-2xl lg:text-3xl font-bold">Koentji.fi</p>
        <div className="hidden lg:block">
          {links.map((link) => (
            <Link key={link.label} href={link.destination}>
              <Button variant="link">{link.label}</Button>
            </Link>
          ))}
        </div>
      </div>
      <div className="hidden lg:flex gap-2">
        <Button variant="ghost" onClick={changeTheme}>
          {currentTheme === "light" ? <Sun /> : <Moon />}
        </Button>
        <ConnectButton />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="block lg:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col gap-2">
            <Button className="w-[4rem]" variant="ghost" onClick={changeTheme}>
              {currentTheme === "light" ? <Sun /> : <Moon />}
            </Button>
            <ConnectButton />
            {links.map((link) => (
              <Link key={link.label} href={link.destination}>
                <Button className="p-0 m-0" variant="link">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
