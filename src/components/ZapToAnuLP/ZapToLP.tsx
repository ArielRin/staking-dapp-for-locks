// Import statements seem correct, ensure they match your project structure
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Button, Box, Input, useToast } from '@chakra-ui/react';
import ZapToLPAbi from './ZapToLPAbi.json';

const ZAP_CONTRACT_ADDRESS = "0x2183ADfE766A3129885d8BdA9CB47A185796674C";

const ZapToLP: React.FC = () => {
  const [ethAmount, setEthAmount] = useState('');
  const toast = useToast();

  const ZapToLP = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: 'Error',
        description: 'Ethereum wallet is not detected. Please install MetaMask.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ZAP_CONTRACT_ADDRESS, ZapToLPAbi, signer);

      const tx = await contract.swapAndAddLiquidity({
        value: ethers.utils.parseEther(ethAmount || '0')
      });

      await tx.wait();

      toast({
        title: 'Success',
        description: 'Liquidity added successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setEthAmount(''); // Reset input after successful transaction
    } catch (error: any) { // Improved error handling with TypeScript
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div>

    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4' >



    <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
     Zap PWR to ANT-PWR LP
     </div>



  <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px' }}>


        <Input
          placeholder="Amount of PWR to convert to ANT LP"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          type="number"
          step="0.01"
          min="0"
        />
        <Button

        textColor='white'
        bg='orange'
        _hover={{ bg: 'orange' }}
        onClick={ZapToLP}
        mt={2}>
          Zap to ANT LP
        </Button>
  </div>


  </Box>

    </div>
  );
};

export default ZapToLP;
