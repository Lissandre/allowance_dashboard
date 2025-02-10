import { PropsWithChildren } from "react";

type EtherscanLinkProps = {
    address: `0x${string}`;
    network?: string;
} & PropsWithChildren;
const EtherscanLink = ({
    children,
    address,
    network = "holesky",
}: EtherscanLinkProps) => {
    const href = `https://${
        network === "mainnet" ? "" : `${network}.`
    }etherscan.io/address/${address}`;
    return (
        <a href={href} target="_blank" rel="noreferrer" role="link">
            {children || address}
        </a>
    );
};
export default EtherscanLink;
