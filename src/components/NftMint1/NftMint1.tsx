
const NFTMINT_CONTRACT_ADDRESS = '0x03965dEc6f765ddCA73282065B9646950a613618';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Image,
  Text,
  Link,
  Container,
  useToast,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import nftMintAbi from './nftMintAbi.json';
import MainTextLogo from './textLogo.png';
import backgroundGif from './bkg33.png';

import './mintNftStyles.css';


function NftMint() {
  const account = useAccount();
  const [contractName, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mintPrice, setMintPrice] = useState(ethers.utils.parseEther("5000")); // Initialize with a default value
  const toast = useToast();

  const contractConfig = {
    addressOrName: NFTMINT_CONTRACT_ADDRESS,
    contractInterface: nftMintAbi,
  };

  const [imgURL, setImgURL] = useState('');
  const { writeAsync: mint, error: mintError } = useContractWrite({
    ...contractConfig,
    functionName: 'mint',
  });

  const [mintLoading, setMintLoading] = useState(false);
  const { address } = useAccount();
  const isConnected = !!address;
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [mintAmount, setMintQuantity] = useState(1);

  const calculateTotalPrice = () => {
    return mintPrice.mul(mintAmount); // BigNumber operation for safe arithmetic
  };

  const handleIncrement = () => {
    setMintQuantity((prevQuantity) => Math.min(prevQuantity + 1, 80));
  };

  const handleDecrement = () => {
    setMintQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const onMintClick = async () => {
    try {
      setMintLoading(true);
      const totalPrice = calculateTotalPrice();

      const tx = await mint({
        args: [mintAmount, { value: totalPrice }],
      });

      await tx.wait(); // Wait for the transaction to be mined
    } catch (error) {
      console.error(error);
    } finally {
      setMintLoading(false);
    }
  };

  async function fetchContractData() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
      const contract = new ethers.Contract(NFTMINT_CONTRACT_ADDRESS, nftMintAbi, provider);
      const name = await contract.name();
      const supply = await contract.totalSupply();
      const price = await contract.mintPrice(); // Fetch mint price
      setContractName(name);
      setTotalSupply(supply.toNumber());
      setMintPrice(price); // Set fetched mint price
    } catch (error) {
      console.error('Error fetching contract data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContractData();
  }, []);

  const maxSupply = 100;
  const remainingSupply = maxSupply - totalSupply;

  return (
    <div className="wrapper" style={{
      backgroundColor: 'black',
      color: 'white',
      backgroundImage: `url(${backgroundGif})`,
      backgroundSize: 'cover',
    }}>
      <div className="mainboxwrapper">
        <Container className="container" paddingY="4">
          <div>
            <Image src={MainTextLogo} alt="Anunaki DeFi" className="logobody" />

            <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '20px' }}>
              Power Surge NFT Collection
            </Text>
            <Text className="totalSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
              {loading ? 'Loading...' : `Sold : ${totalSupply} / ${maxSupply}`}
            </Text>
            <Text className="remainingSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
              {loading ? 'Loading...' : `Remaining Supply: ${remainingSupply}`}
            </Text>
            <Text className="remainingSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
            Contract announced with launch.
            </Text>
            <Link isExternal href={`https://scan.maxxchain.org/token/${NFTMINT_CONTRACT_ADDRESS}`} className="contractaddr" style={{ display: 'block', textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
              View on Explorer
            </Link>
          </div>
          {remainingSupply > 0 ? (
            <>
              <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '45px'}}>
                Price on Launch!
              </Text>
              <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
                <Button
                  onClick={handleDecrement}
                  disabled={mintAmount <= 1 || mintLoading || remainingSupply === 0}
                  textColor='white'
                  bg='#642016'
                  _hover={{ bg: '#bd4530' }}>
                  -
                </Button>
                <Text mx='4'>{mintAmount}</Text>
                <Button
                  onClick={handleIncrement}
                  disabled={mintAmount >= remainingSupply || mintLoading}
                  textColor='white'
                  bg='#642016'
                  _hover={{ bg: '#bd4530' }}>
                  +
                </Button>
              </Box>

              <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>

                <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '30px' }}>
                  Coming Soon!
                </Text>
              </Box>
            </>
          ) : (
            <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '30px' }}>
              Minting has Completed!
            </Text>
          )}
          {mintError && <Text color="red.500" mt="4">Error: {mintError.message}</Text>}
        </Container>
      </div>
    </div>
  );
}

export default NftMint;
//
// <Button
//   onClick={onMintClick}
//   isLoading={mintLoading}
//   loadingText="Minting..."
//   bg='#642016'
//   _hover={{ bg: '#bd4530' }}
//   variant="solid"
//   marginTop="4"
// >
//   Mint Now
// </Button>
