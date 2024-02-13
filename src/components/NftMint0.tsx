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
import nftMintAbi from './NftMint0/nftMintAbi.json';
import MainTextLogo from './NftMint0/textLogo.png';
import backgroundGif from './NftMint0/bmt2bkg.gif';

const NFTMINT_CONTRACT_ADDRESS = '0x074EDe9bB8F37e1D902D988769D2f1af0F929C23';

const getExplorerLink = () => `https://scan.maxxchain.org/token/${NFTMINT_CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${NFTMINT_CONTRACT_ADDRESS}`;

import './NftMint0/mintNftStyles.css';

function NftMint() {
  const { address } = useAccount();
  const isConnected = !!address;
  const toast = useToast();
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mintAmount, setMintQuantity] = useState(1);
  const [mintLoading, setMintLoading] = useState(false);
  const [mintError, setMintError] = useState<Error | null>(null);
  const maxSupply = 200;
  const remainingSupply = maxSupply - totalSupply;

  useEffect(() => {
    async function fetchContractData() {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://mainrpc4.maxxchain.org/');
        const contract = new ethers.Contract(NFTMINT_CONTRACT_ADDRESS, nftMintAbi, provider);
        const supply = await contract.totalSupply();
        setTotalSupply(supply.toNumber());
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContractData();
  }, []);

  const contractConfig = {
    addressOrName: NFTMINT_CONTRACT_ADDRESS,
    contractInterface: nftMintAbi,
  };

  const { writeAsync: mint } = useContractWrite({
    ...contractConfig,
    functionName: 'mint',
    onError: (error: Error) => setMintError(error),
  });

  const onMintClick = async () => {
    if (!isConnected || remainingSupply === 0) return;
    try {
      setMintLoading(true);
      const tx = await mint({ args: [mintAmount] }); // Modify according to your contract
      await tx.wait();
      toast({
        title: 'Mint Successful',
        description: `Successfully minted ${mintAmount} NFT(s).`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Minting error:', error);
    } finally {
      setMintLoading(false);
    }
  };

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
                Bitmaxx NFT 2 Collection
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
                  bg='#4656a3'
                  _hover={{ bg: '#260c3f' }}>
                  -
                </Button>
                <Text mx='4'>{mintAmount}</Text>
                <Button
                  onClick={() => setMintQuantity(mintAmount + 1)}
                  disabled={mintAmount >= remainingSupply || mintLoading}
                  textColor='white'
                  bg='#4656a3'
                  _hover={{ bg: '#260c3f' }}>
                  +
                </Button>
              </Box>
              <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
              <Button
                onClick={onMintClick}
                disabled={!isConnected || mintLoading || remainingSupply === 0}
                textColor='white'
                bg='#4656a3'
                _hover={{ bg: '#260c3f' }}
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
