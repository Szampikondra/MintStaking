import { FC } from 'react';
import { ThirdwebNftMedia, useContract, useNFT, Web3Button } from '@thirdweb-dev/react';
import { Contract } from 'ethers';

interface NFTCardProps {
    tokenId: number;
}


const NFTCard: FC<NFTCardProps> = ({ tokenId }) => {
    const bonsaiAddress = "0x8Ec894C2dBd9b373c06dE5E4EB8617F839a03C05";
    const stakingAddress = "0x6b601c4280c2966FA641ECAf5A44B2faF7D8E942";

    const { contract: bonsaiContract } = useContract(bonsaiAddress, "nft-drop");
    const { contract: stakingContract } = useContract(stakingAddress);
    const { data: nft } = useNFT(bonsaiContract, tokenId);

async function withdraw(nftId: string) {
    await stakingContract?.call("withdraw", [nftId]);
}

    return (
        <>
            
{nft && (
    <div>
        {nft.metadata && (
        <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      ><ThirdwebNftMedia
     metadata={nft.metadata}
        height="100px"
        width="100px"
        /></div>
      )}
      <h3><div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >{nft.metadata.name}</div></h3>
      <Web3Button
      action={(Contract) => Contract?.call("withdraw",[[nft.metadata.id]])}
      contractAddress={stakingAddress}>
        Withdraw
      </Web3Button>
    </div>
)}
        </>
    )
}
export default NFTCard;

