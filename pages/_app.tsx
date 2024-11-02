import Footer from "@/components/footer";
import Header from "@/components/header";
import {
  Chain,
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import "../styles/globals.css";

const ganacheChain: Chain = {
  id: 1337,
  name: "Ganache",
  network: "ganache",
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

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ganacheChain],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Faucet",
  projectId: "c8d08053460bfe0752116d730dc6393b",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
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
    </WagmiConfig>
  );
}

export default MyApp;
