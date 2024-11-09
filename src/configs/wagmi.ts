import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    arbitrumSepolia
} from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
    appName: 'RainbowKit',
    projectId: 'c8d08053460bfe0752116d730dc6393b',
    chains: [
        arbitrumSepolia
    ],
});