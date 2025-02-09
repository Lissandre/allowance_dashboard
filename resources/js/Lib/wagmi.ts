import { createConfig, http } from "wagmi";
import { holesky } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
    chains: [holesky],
    transports: {
        [holesky.id]: http(),
    },
    connectors: [injected()],
});
