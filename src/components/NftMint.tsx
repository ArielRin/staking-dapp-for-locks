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
import nftMintAbi from './NftMint/nftMintAbi.json';
import MainTextLogo from './NftMint/textLogo.png';
import backgroundGif from './NftMint/anianu.gif';

import './NftMint/mintNftStyles.css';


const NFTMINT_CONTRACT_ADDRESS = '0x03965dEc6f765ddCA73282065B9646950a613618';

function NftMint() {
  const account = useAccount();
  const [contractName, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(true);


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
    const pricePerToken = 5000; // Adjust the price per token as needed
    return ethers.utils.parseEther((mintAmount * pricePerToken).toString());
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
      setContractName(name);
      setTotalSupply(supply.toNumber());
    } catch (error) {
      console.error('Error fetching contract data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContractData();
  }, []);

  const maxSupply = 106;
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
                Anunaki NFT Collection
              </Text>
            <Text className="totalSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
              {loading ? 'Loading...' : `Sold : ${totalSupply} / ${maxSupply}`}
            </Text>
            <Text className="remainingSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
              {loading ? 'Loading...' : `Remaining Supply: ${remainingSupply}`}
            </Text>
            <Link isExternal href={`https://scan.maxxchain.org/token/${NFTMINT_CONTRACT_ADDRESS}`} className="contractaddr" style={{ display: 'block', textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
              {NFTMINT_CONTRACT_ADDRESS}
            </Link>
            <Link isExternal href={`https://scan.maxxchain.org/token/${NFTMINT_CONTRACT_ADDRESS}`} className="contractaddr" style={{ display: 'block', textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
              View on Explorer
            </Link>
          </div>
          {remainingSupply > 0 ? (
            <>
              <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                Now only 5,000 PWR Each
              </Text>
              <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
                <Button
                  onClick={() => setMintQuantity(mintAmount - 1)}
                  disabled={mintAmount <= 1 || mintLoading || remainingSupply === 0}
                  textColor='white'
                  bg='#fcbb63'
                  _hover={{ bg: '#ea971c' }}>
                  -
                </Button>
                <Text mx='4'>{mintAmount}</Text>
                <Button
                  onClick={() => setMintQuantity(mintAmount + 1)}
                  disabled={mintAmount >= remainingSupply || mintLoading}
                  textColor='white'
                  bg='#fcbb63'
                  _hover={{ bg: '#ea971c' }}>
                  +
                </Button>
              </Box>
              <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
              <Button
                onClick={onMintClick}
                disabled={!isConnected || mintLoading || remainingSupply === 0}
                textColor='white'
                bg='#fcbb63'
                _hover={{ bg: '#ea971c' }}
                marginTop='4'>
                Mint Now
              </Button>
            </Box>
            </>
          ) : (
            <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '20px' }}>
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
