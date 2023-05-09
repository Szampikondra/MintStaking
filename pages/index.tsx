import { useContract, useAddress, Web3Button, useOwnedNFTs, ThirdwebNftMedia, useContractRead,  } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { BigNumber, ethers } from "ethers";
import NFTCard from "../Components/NFTCard";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const address = useAddress();

  const bonsaiAddress = "0x8Ec894C2dBd9b373c06dE5E4EB8617F839a03C05";
  const stakingAddress = "0x6b601c4280c2966FA641ECAf5A44B2faF7D8E942";

const { contract: bonsaiContract } = useContract(bonsaiAddress, "nft-drop");
const {contract: stakingContract } = useContract(stakingAddress);

const { data: myBonsaiNFTs} = useOwnedNFTs(bonsaiContract, address);
const { data: stakedBonsaiNFTs } = useContractRead(stakingContract, "getStakeInfo", [address,]);

async function stakeNFT(nftId: string) {
  if(!address) return;
  
  const isApproved = await bonsaiContract?.isApproved(
    address,
    stakingAddress
  );

  if(!isApproved) {
    await bonsaiContract?.setApprovalForAll(stakingAddress, true);
   }

   await stakingContract?.call("stake", [[nftId]])
  } 

   const [claimableRewards, setClaimableRewards] = useState<BigNumber>();

   useEffect(() => {
    if(!stakingContract || !address) return;

    async function loadClaimableRewards() {
      const stakeInfo = await stakingContract?.call("getStakeInfo", [address])
      setClaimableRewards(stakeInfo[1]);
    }

    loadClaimableRewards();
   }, [address, stakingContract]);

 return (
    <div className={styles.container}>
      <main className={styles.main}>
       <h1> Free Mint </h1>
       <b><h2>Bonsai NFT</h2></b>
       <Web3Button
       contractAddress={bonsaiAddress}
       action={(bonsaiContract) => bonsaiContract.erc721.claim(1)}
       >Claim FREE MINT</Web3Button>
       <br />
       <h1>Your NFT'S</h1>
       <div>
        {myBonsaiNFTs?.map((nft) => (
          <div>
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
            <h3><div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >{nft.metadata.name}</div></h3>
            <Web3Button
            contractAddress={stakingAddress}
            action={() => stakeNFT(nft.metadata.id)}>
              Stake
              </Web3Button>
            </div>  
        ))}
       </div>
       <h1>Your Stak</h1>
      <div>
         {stakedBonsaiNFTs && stakedBonsaiNFTs[0].map((stakeNFT: BigNumber) => (
           <div key={stakeNFT.toString()}>
          <NFTCard tokenId={stakeNFT.toNumber()} />
     </div>
  ))}
</div>
<br />
<h1>You Earn $SEED:</h1>
{!claimableRewards ? "Loading..." : ethers.utils.formatUnits(claimableRewards, 18)}
<Web3Button
contractAddress={stakingAddress}
action={(stakingContract) => stakingContract.call("claimRewards")}
>Claim $SEED</Web3Button>
      </main>
    </div>
  );
};

export default Home;
