import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { wagmiConfig } from "@/configs/wagmi";
import {
  Chain,
  darkTheme,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import "../styles/globals.css";

const localChain: Chain = {
  id: 1337,
  name: "Ganache",
  nativeCurrency: {
    decimals: 18,
    name: "Ganache Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://ganache.renakaagusta.dev"],
    },
    public: {
      http: ["https://ganache.renakaagusta.dev"],
    },
  },
  blockExplorers: {
    default: {
      name: "Ganache Explorer",
      url: "https://ganache.renakaagusta.dev",
    },
  },
  testnet: true,
};

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={arbitrumSepolia}
          theme={darkTheme({
            accentColor: 'white',
            accentColorForeground: 'black',
          })}
        >
          <ThemeProvider
            disableTransitionOnChange
            attribute="class"
            value={{ light: "light", dark: "dark" }}
            defaultTheme="system"
          >
            <Header />
            <Component {...pageProps} />
            <Footer />
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
