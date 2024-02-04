

import React, { useEffect, useState } from 'react';

import {
  Box,
  Flex,
  Text,
  Link,
  Container,
  Spacer,
  useBreakpointValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';

import Web3 from 'web3';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import abiFile from './abiFile.json';
import tokenAbi from './tokenAbi.json';
import './styles.css';

const CONTRACT_ADDRESS = '0xaddresshere';
const TOKEN_ADDRESS = '0x3e69bA6Dd72e39A1694B85775944f713Fe0a0e9B'; //og lastman

const getExplorerLink = () => `https://bscscan.com/address/${CONTRACT_ADDRESS}`;
const BLOCK_RATE_SECONDS = 3; // BSC block rate

const App = () => {
  // Use Chakra UI's useBreakpointValue hook to adjust layout for different screen sizes
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  const headerTextStyle = {
    fontSize: '28px', // Increased font size
    fontWeight: 'bold', // Make the text bolder
    color: '#f8f8ff', // Off-white color
  };

  return (
      <>
        <Box p={4} color="white" bg="blue.500">
          <Flex justifyContent="space-between" alignItems="center">
            <Text style={headerTextStyle}>Staking for Locks</Text>
            <ConnectButton />
          </Flex>
        </Box>

        <Container maxW="container.xl" p={4}>
          <Flex direction="column" gap={4}>
            <Box h="400px" bg="gray.200" p={4}>
              Do first Content for First Row
            </Box>

            {/* Adjusted Flex container for equal height columns */}
            <Flex direction={{ base: "column", md: "row" }} gap={4}>
              <Box flex={1} bg="gray.300" p={4} display="flex" flexDirection="column">
                {/* Tabs in Left Column */}
                <Tabs isFitted variant="enclosed" flex="1">
                  <TabList mb="1em">
                    <Tab>30 Days</Tab>
                    <Tab>90 Days</Tab>
                    <Tab>180 Days</Tab>
                    <Tab>More</Tab>
                  </TabList>
                  <TabPanels flex="1">
                    <TabPanel>
                      <Box minH="350px">
                        Content for 30 Days
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <Box minH="350px">
                        Content for 90 Days
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <Box minH="350px">
                        Content for 180 Days
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <Box minH="350px">
                        Add More stuff to More
                      </Box>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>

              <Box flex={1} bg="gray.400" p={4} display="flex" flexDirection="column">
                Content for Right Column in Second Row
              </Box>
            </Flex>

            <Box h="400px" bg="gray.500" p={4}>
              Content for Third Row
            </Box>
          </Flex>
        </Container>

        <Box p={4} color="white" bg="black" textAlign="center">
          © 2024 In Haus Development
        </Box>
      </>
    );
  };

  export default App;
