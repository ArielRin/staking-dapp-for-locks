
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

  VStack
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


import tokenLogo from './pst.png';

import btmLogo from './BTM.png';

import anuLogo from './anu.png';

import pw3Logo from './pw3.png';
import backgroundImage from './bkg.png';
import backgroundImageStake from './stake.png';



const CONTRACT_ADDRESS = '0xaA0015FbB55b0f9E3dF74e0827a63099e4201E38'; // Live BTM_NFT
const TOKEN_ADDRESS = '0x3e69bA6Dd72e39A1694B85775944f713Fe0a0e9B'; //og lastman

const getExplorerLink = () => `https://bscscan.com/address/${CONTRACT_ADDRESS}`;
const BLOCK_RATE_SECONDS = 3; // BSC block rate



const TOKEN_IMAGE = 'https://raw.githubusercontent.com/ArielRin/staking-dapp-for-locks/master/src/pst.png';
const TOKEN_SYMBOL = 'PST';
const TOKEN_DECIMALS = 18;

const INITIAL_SUPPLY = 100000000; //  set at 1,000,000


const App = () => {

  // add token to metamask
  // ##############################################################
  // ##############################################################
  const handleAddToken = () => {
    if (window.ethereum) {
      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: TOKEN_ADDRESS,
            symbol: TOKEN_SYMBOL,
            decimals: TOKEN_DECIMALS,
            image: 'https://raw.githubusercontent.com/ArielRin/staking-dapp-for-locks/master/src/pst.png',
          },
        },
      })
      .then((success) => {
        if (success) {
          console.log('Token successfully added to wallet!');
        } else {
          console.log('Token not added to wallet.');
        }
      })
      .catch(console.error);
    } else {
      console.log('MetaMask is not installed!');
    }
  };

   // ##############################################################
   // ##############################################################
   const addTokenToWallet = async () => {
      if (window.ethereum) {
        try {
          const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20',
              options: {
                address: TOKEN_ADDRESS,
                symbol: TOKEN_SYMBOL,
                decimals: TOKEN_DECIMALS,
                image: 'https://raw.githubusercontent.com/ArielRin/staking-dapp-for-locks/master/src/pst.png',
              },
            },
          });

          if (wasAdded) {
            console.log('Token was added to wallet!');
          } else {
            console.log('Token was not added to wallet.');
          }
        } catch (error) {
          console.error('Error adding token to wallet', error);
        }
      } else {
        console.log('Ethereum object does not exist!');
      }
    };

   // ##############################################################

   // copy token address to memory
   // ##############################################################
   // ##############################################################
   const [copySuccess, setCopySuccess] = useState('');

   const copyToClipboard = () => {
     navigator.clipboard.writeText(TOKEN_ADDRESS)
       .then(() => {
         setCopySuccess('Address Copied!');
         setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
       })
       .catch(err => {
         console.error('Failed to copy: ', err);
         setCopySuccess('Failed to copy');
       });
   };

   // ##############################################################
   // ##############################################################

   //fetch  supply data of PRT
   // ##############################################################
   // ##############################################################









   // ##############################################################
   // ##############################################################


   // fetch marketcap from api
   // ##############################################################
   // ##############################################################
   const [marketCap, setMarketCap] = useState('Loading...');
   const [totalReserveInUSD, setTotalReserveInUSD] = useState('Loading...');

   // ... (existing useEffect hooks)

   // Fetch Market Cap and Total Reserve data
   useEffect(() => {
     const url = `https://api.geckoterminal.com/api/v2/networks/maxxchain/tokens/${TOKEN_ADDRESS}`;

     fetch(url)
       .then(response => response.json())
       .then(data => {
         if (data && data.data && data.data.attributes) {
           if (data.data.attributes.fdv_usd) {
             const fdvUsd = data.data.attributes.fdv_usd;
             setMarketCap(`${parseFloat(fdvUsd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`); // Format as currency
           } else {
             setMarketCap('Market Cap not available');
           }

           if (data.data.attributes.total_reserve_in_usd) {
             const reserveUsd = data.data.attributes.total_reserve_in_usd;
             setTotalReserveInUSD(`${parseFloat(reserveUsd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`); // Format as currency
           } else {
             setTotalReserveInUSD('Total Reserve not available');
           }
         } else {
           setMarketCap('Data not available');
           setTotalReserveInUSD('Data not available');
         }
       })
       .catch(error => {
         console.error('Error fetching data:', error);
         setMarketCap('Error fetching data');
         setTotalReserveInUSD('Error fetching data');
       });
   }, []);
     // ##############################################################
     // ##############################################################


       // ##############################################################
       // ##############################################################

   const [totalLiquidityUSD, setTotalLiquidityUSD] = useState('Loading...');

   useEffect(() => {
     if (totalReserveInUSD !== 'Loading...' && totalReserveInUSD !== 'Total Reserve not available' && totalReserveInUSD !== 'Error fetching data') {
       // Extract the number from the formatted currency string
       const reserveValue = Number(totalReserveInUSD.replace(/[^0-9.-]+/g, ""));
       const liquidityValue = reserveValue * 2;
       setTotalLiquidityUSD(`${liquidityValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`); // Format as currency
     }
   }, [totalReserveInUSD]); // Dependency on totalReserveInUSD



  const { address } = useAccount();
  const isConnected = !!address;


  // Use Chakra UI's useBreakpointValue hook to adjust layout for different screen sizes
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  const headerTextStyle = {
    fontSize: '28px', // Increased font size
    fontWeight: 'bold', // Make the text bolder
    color: '#f8f8ff', // Off-white color
  };

    const tokenContractConfig = {
      addressOrName: TOKEN_ADDRESS,
      contractInterface: tokenAbi,
    };

    const account = useAccount();
    const [contractName, setContractName] = useState('');
    const [loading, setLoading] = useState(true);






    const { writeAsync: claimTokens } = useContractWrite({
      ...tokenContractConfig,
      functionName: 'claim',
    });

    const onClaimClick = async () => {
    try {
      const tx = await claimTokens();
      await tx.wait();
      toast.success('Claim successful!');
    } catch (error) {
      console.error(error);
      toast.error('Claim failed. Please try again.');
    }
  };

      const [rewardsToClaim, setRewardsToClaim] = useState('Loading...');

      useEffect(() => {
        const fetchRewardsToClaim = async () => {
          if (address) {
            try {
              const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
              const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

              const rewards = await tokenContract.withdrawableDividendOf(address);
              // Format rewards and set it to 4 decimal places
              const formattedRewards = ethers.utils.formatUnits(rewards, 'ether');
              setRewardsToClaim(parseFloat(formattedRewards).toFixed(4)); // Now the rewards are a string with 4 decimal places
            } catch (error) {
              console.error('Error fetching rewards:', error);
              setRewardsToClaim('Error');
            }
          }
        };

        fetchRewardsToClaim();
      }, [address]); // Fetch rewards when the address changes











        //fetch btm pricePerBtm in usd
        const [btmPriceUSD, setBtmPriceUSD] = useState('Loading...');
          const btmAddress = '0xc27bbd4276f9eb2d6f2c4623612412d52d7bb43d'; // Your btm address

          useEffect(() => {
            const url = `https://api.geckoterminal.com/api/v2/simple/networks/maxxchain/token_price/${btmAddress}`;

            fetch(url)
              .then(response => response.json())
              .then(data => {
                if (data && data.data && data.data.attributes && data.data.attributes.token_prices) {
                  const price = data.data.attributes.token_prices[btmAddress];
                  setBtmPriceUSD(`${parseFloat(price).toFixed(6)} USD`); // Format the price to 6 decimal places
                } else {
                  setBtmPriceUSD('Price not available');
                }
              })
              .catch(error => {
                console.error('Error fetching btm price:', error);
                setBtmPriceUSD('Error fetching price');
              });
          }, []);




      //fetch anu pricePerAnu in usd
      const [anuPriceUSD, setAnuPriceUSD] = useState('Loading...');
        const anuAddress = '0x6cb6c8d16e7b6fd5a815702b824e6dfdf148a7d9'; // Your anu address

        useEffect(() => {
          const url = `https://api.geckoterminal.com/api/v2/simple/networks/maxxchain/token_price/${anuAddress}`;

          fetch(url)
            .then(response => response.json())
            .then(data => {
        if (data && data.data && data.data.attributes && data.data.attributes.token_prices) {
                const price = data.data.attributes.token_prices[anuAddress];
                setAnuPriceUSD(`${parseFloat(price).toFixed(6)} USD`); // Format the price to 6 decimal places
              } else {
                setAnuPriceUSD('Price not available');
              }
            })
            .catch(error => {
              console.error('Error fetching anu price:', error);
              setAnuPriceUSD('Error fetching price');
            });
        }, []);



  //fetch token pricePerToken in usd
  const [tokenPriceUSD, setTokenPriceUSD] = useState('Loading...');
    const tokenAddress = '0x3e69ba6dd72e39a1694b85775944f713fe0a0e9b'; // Your token address

    useEffect(() => {
      const url = `https://api.geckoterminal.com/api/v2/simple/networks/maxxchain/token_price/${tokenAddress}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data && data.data && data.data.attributes && data.data.attributes.token_prices) {
            const price = data.data.attributes.token_prices[tokenAddress];
            setTokenPriceUSD(`${parseFloat(price).toFixed(6)} USD`); // Format the price to 6 decimal places
          } else {
            setTokenPriceUSD('Price not available');
          }
        })
        .catch(error => {
          console.error('Error fetching token price:', error);
          setTokenPriceUSD('Error fetching price');
        });
    }, []);

    const [pwrPriceUSD, setPwrPriceUSD] = useState('Loading...');
   const pwrTokenAddress = '0xa29d0ee618f33d8efe9a20557fd0ef63dd050859'; // PWR token address on BSC

   useEffect(() => {
     const url = `https://api.geckoterminal.com/api/v2/simple/networks/maxxchain/token_price/${pwrTokenAddress}`;

     fetch(url)
       .then(response => response.json())
       .then(data => {
         if (data && data.data && data.data.attributes && data.data.attributes.token_prices) {
           const price = data.data.attributes.token_prices[pwrTokenAddress];
           setPwrPriceUSD(`${parseFloat(price).toFixed(6)} USD`); // Format the price to 6 decimal places
         } else {
           setPwrPriceUSD('Price not available');
         }
       })
       .catch(error => {
         console.error('Error fetching PWR price:', error);
         setPwrPriceUSD('Error fetching price');
       });
   }, []);

  //  const [bnbPriceUSD, setBnbPriceUSD] = useState('Loading...');
  // const bnbTokenAddress = '0xa29d0ee618f33d8efe9a20557fd0ef63dd050859'; // BNB token address on BSC
  //
  // useEffect(() => {
  //   const url = `https://api.geckoterminal.com/api/v2/simple/networks/maxchain/token_price/${bnbTokenAddress}`;
  //
  //   fetch(url)
  //     .then(response => response.json())
  //     .then(data => {
  //       if (data && data.data && data.data.attributes && data.data.attributes.token_prices) {
  //         const price = data.data.attributes.token_prices[bnbTokenAddress];
  //         setBnbPriceUSD(`${parseFloat(price).toFixed(6)} USD`); // Format the price to 6 decimal places
  //       } else {
  //         setBnbPriceUSD('Price not available');
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching BNB price:', error);
  //       setBnbPriceUSD('Error fetching price');
  //     });
  // }, []);

  const [rewardsValueInUSD, setRewardsValueInUSD] = useState('Loading...');

    useEffect(() => {
      // Calculate rewards in USD
      const pwrPrice = parseFloat(pwrPriceUSD.replace(' USD', ''));
      const rewardsAmount = parseFloat(rewardsToClaim);

      if (!isNaN(pwrPrice) && !isNaN(rewardsAmount)) {
        const calculatedValue = (rewardsAmount * pwrPrice).toFixed(2); // Format the result to 2 decimal places
        setRewardsValueInUSD(`${calculatedValue} USD`);
      } else {
        setRewardsValueInUSD('Calculating...');
      }
    }, [pwrPriceUSD, rewardsToClaim]);





    // fetch token balance
    const [tokenBalance, setTokenBalance] = useState('Loading...');

    useEffect(() => {
      const fetchTokenBalance = async () => {
        if (address) {
          try {
            const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
            const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

            const balance = await tokenContract.balanceOf(address);
            // Format balance and set it to 2 decimal places
            const formattedBalance = ethers.utils.formatUnits(balance, 'ether');
            setTokenBalance(parseFloat(formattedBalance).toFixed(0)); // Now the balance is a string with 2 decimal places
          } catch (error) {
            console.error('Error fetching balance:', error);
            setTokenBalance('Error');
          }
        }
      };

      fetchTokenBalance();
    }, [address]); // Fetch balance when the address changes





// Token Staking
// ######################################################################################################################################################################
// ##################################



      const { writeAsync: unstake1Month } = useContractWrite({
        ...tokenContractConfig,
        functionName: 'Unstake1Month',
      });
      const onUnstake1MonthClick = async () => {
        try {
          const tx = await unstake1Month();
          await tx.wait();
          toast.success('Unstaking successful!');
        } catch (error) {
          console.error(error);
          toast.error('Unstaking failed. Please Check your Unlock Date in dapp.');
        }
      };
    // State for staking amount
     const [stakeAmount, setStakeAmount] = useState('');

     // Contract write hook for staking in the token contract
     const { writeAsync: stakeFor1Month } = useContractWrite({
       ...tokenContractConfig,
       functionName: 'StakeFor1Month',
     });

     // Function to handle staking
     const onStakeClick = async () => {
       try {
         if (!stakeAmount) {
           toast.error('Please enter an amount to stake.');
           return;
         }

         // Convert the stake amount to Wei
         const stakeAmountInWei = ethers.utils.parseUnits(stakeAmount, 'wei');

         // Call the StakeFor1Month function in the contract
         const tx = await stakeFor1Month({
           args: [stakeAmountInWei],
         });

         await tx.wait();
         toast.success('Staking successful!');
       } catch (error) {
         console.error(error);
         toast.error('Staking failed. Please try again.');
       }
     };


      // is the user staked
        const [userStaked, setUserStaked] = useState('Loading...');

        useEffect(() => {
         const fetchUserStakedStatus = async () => {
           if (address) {
             try {
               const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
               const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

               const isStaked = await tokenContract._isStaked1Month(address);
               setUserStaked(isStaked.toString());
             } catch (error) {
               console.error('Error fetching staking status:', error);
               setUserStaked('Error');
             }
           }
         };

         fetchUserStakedStatus();
       }, [address]); // Fetch staking status when the address changes

      // amount staked 1 month pool
        const [tokensStaked1Month, setTokensStaked1Month] = useState('Loading...');

        useEffect(() => {
           const fetchTokensStaked1Month = async () => {
             if (address) {
               try {
                 const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                 const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                 const tokens = await tokenContract.tokensStaked1Month(address);
                 setTokensStaked1Month(ethers.utils.formatUnits(tokens, 'ether')); // Adjust based on your token's decimals
               } catch (error) {
                 console.error('Error fetching tokens staked for 1 month:', error);
                 setTokensStaked1Month('Error');
               }
             }
           };

           fetchTokensStaked1Month();
         }, [address]); // Fetch when the address changes
         const [availableBalance, setAvailableBalance] = useState('Loading...');

          // Assuming TOKEN_ADDRESS and tokenAbi are defined elsewhere in your code
          useEffect(() => {
            const fetchBalances = async () => {
              if (address) {
                try {
                  const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                  const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                  // Fetch the balance and staked amounts
                  const balancePromise = tokenContract.balanceOf(address);
                  const staked1MonthPromise = tokenContract.tokensStaked1Month(address);
                  const staked3MonthsPromise = tokenContract.tokensStaked3Months(address); // Assuming a similar method exists
                  const staked6MonthsPromise = tokenContract.tokensStaked6Months(address); // Assuming a similar method exists

                  // Use Promise.all to fetch all values concurrently
                  const [balance, staked1Month, staked3Months, staked6Months] = await Promise.all([
                    balancePromise,
                    staked1MonthPromise,
                    staked3MonthsPromise,
                    staked6MonthsPromise,
                  ]);

                  // Calculate the total staked amount using BigNumber to prevent precision loss
                  const totalStaked = staked1Month.add(staked3Months).add(staked6Months);

                  // Calculate the available balance
                  const available = balance.sub(totalStaked);

                  // Format the available balance for display
                  const formattedAvailable = ethers.utils.formatUnits(available, 'ether');
                  setAvailableBalance(parseFloat(formattedAvailable).toFixed(0));
                } catch (error) {
                  console.error('Error fetching balances:', error);
                  setAvailableBalance('Error');
                }
              }
            };

            fetchBalances();
          }, [address]); // Re-run the effect if the user's address changes


        const [unlockTime, setUnlockTime] = useState('Loading...');

        useEffect(() => {
          const fetchUnlockTime = async () => {
            if (address) {
              try {
                const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                const stakedTimestamp = await tokenContract._staked1MonthTimestamp(address);
                const currentBlock = await provider.getBlock('latest');
                const currentTime = currentBlock.timestamp;

                const timeDiff = stakedTimestamp - currentTime;
                if (timeDiff <= 0) {
                  setUnlockTime('Unlocked');
                  return;
                }

                const days = Math.floor(timeDiff / (24 * 3600));
                const hours = Math.floor((timeDiff % (24 * 3600)) / 3600);
                const minutes = Math.floor((timeDiff % 3600) / 60);
                const seconds = Math.floor(timeDiff % 60);

                setUnlockTime(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
              } catch (error) {
                console.error('Error fetching unlock time:', error);
                setUnlockTime('Error');
              }
            }
          };

          fetchUnlockTime();
        }, [address]);



        const [stakedTimestamp, setStakedTimestamp] = useState('Loading...');

        useEffect(() => {
          const fetchStakedTimestamp = async () => {
            if (address) {
              try {
                const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                const timestamp = await tokenContract._staked1MonthTimestamp(address);
                const date = new Date(timestamp.toNumber() * 1000).toLocaleString(); // Convert timestamp to readable date
                setStakedTimestamp(date);
              } catch (error) {
                console.error('Error fetching staked timestamp:', error);
                setStakedTimestamp('Error');
              }
            }
          };

          fetchStakedTimestamp();
        }, [address]);


        const [stakedBlockNumber, setStakedBlockNumber] = useState('Loading...');

        useEffect(() => {
         const fetchStakedBlockNumber = async () => {
           if (address) {
             try {
               const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
               const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

               const stakedTimestampBN = await tokenContract._staked1MonthTimestamp(address);
               const stakedTimestamp = stakedTimestampBN.toNumber();

               const currentBlock = await provider.getBlock('latest');
               const currentTimestamp = currentBlock.timestamp;
               const currentBlockNumber = currentBlock.number;

               // Estimate the block number of the staked timestamp
               const blockDifference = (stakedTimestamp - currentTimestamp) / BLOCK_RATE_SECONDS;
               const estimatedStakedBlockNumber = currentBlockNumber + Math.round(blockDifference);

               setStakedBlockNumber(estimatedStakedBlockNumber.toString());
             } catch (error) {
               console.error('Error fetching staked block number:', error);
               setStakedBlockNumber('Error');
             }
           }
         };

         fetchStakedBlockNumber();
       }, [address]);

         const [unlockDate, setUnlockDate] = useState('Loading...');

         useEffect(() => {
          const fetchUnlockDate = async () => {
            if (address) {
              try {
                const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                const stakedTimestampBN = await tokenContract._staked1MonthTimestamp(address);
                const stakedTimestamp = stakedTimestampBN.toNumber();

                // Add 30 days to the staked timestamp
                const unlockTimestamp = new Date(stakedTimestamp * 1000);
                unlockTimestamp.setDate(unlockTimestamp.getDate() + 30);

                setUnlockDate(unlockTimestamp.toLocaleDateString());
              } catch (error) {
                console.error('Error fetching unlock date:', error);
                setUnlockDate('Error');
              }
            }
          };

          fetchUnlockDate();
        }, [address]);



    // ######################################################################################################################################################################
    // ##################################
    // unstake tokens 3month
    // ##################################

        const { writeAsync: Unstake3Months } = useContractWrite({
          ...tokenContractConfig,
          functionName: 'Unstake3Months',
        });
        const onUnstake3MonthsClick = async () => {
          try {
            const tx = await Unstake3Months();
            await tx.wait();
            toast.success('Unstaking successful!');
          } catch (error) {
            console.error(error);
            toast.error('Unstaking failed. Please Check your Unlock Date in dapp.');
          }
        };


        // ##################################
            // State for staking amount
            // ##################################
             const [stakeAmount3Months, setStakeAmount3Months] = useState('');

             // Contract write hook for staking in the token contract
             const { writeAsync: stakeFor3Months } = useContractWrite({
               ...tokenContractConfig,
               functionName: 'StakeFor3Months',
             });

             // Function to handle staking
             const onStakeClick3Months = async () => {
               try {
                 if (!stakeAmount3Months) {
                   toast.error('Please enter an amount to stake.');
                   return;
                 }

                 // Convert the stake amount to Wei
                 const stakeAmount3MonthsInWei = ethers.utils.parseUnits(stakeAmount3Months, 'wei');

                 // Call the StakeFor3Months function in the contract
                 const tx = await stakeFor3Months({
                   args: [stakeAmount3MonthsInWei],
                 });

                 await tx.wait();
                 toast.success('Staking successful!');
               } catch (error) {
                 console.error(error);
                 toast.error('Staking failed. Please try again.');
               }
             };

    // ##################################
      // is the user staked
      // ##################################


        const [userStaked3Months, setUserStaked3Months] = useState('Loading...');

        useEffect(() => {
         const fetchUserStaked3MonthsStatus = async () => {
           if (address) {
             try {
               const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
               const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

               const isStaked = await tokenContract._isStaked3Months(address);
               setUserStaked3Months(isStaked.toString());
             } catch (error) {
               console.error('Error fetching staking status:', error);
               setUserStaked3Months('Error');
             }
           }
         };

         fetchUserStaked3MonthsStatus();
       }, [address]); // Fetch staking status when the address changes






         // amount staked 3 month pool
           const [tokensStaked3Months, setTokensStaked3Months] = useState('Loading...');

           useEffect(() => {
              const fetchTokensStaked3Months = async () => {
                if (address) {
                  try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                    const tokens = await tokenContract.tokensStaked3Months(address);
                    setTokensStaked3Months(ethers.utils.formatUnits(tokens, 'ether')); // Adjust based on your token's decimals
                  } catch (error) {
                    console.error('Error fetching tokens staked for 1 month:', error);
                    setTokensStaked3Months('Error');
                  }
                }
              };

              fetchTokensStaked3Months();
            }, [address]); // Fetch when the address changes


         // available balance after staking locks
         const [availableBalance3Months, setAvailableBalance3Months] = useState('Loading...');

         useEffect(() => {
           const fetchBalances3Months = async () => {
             if (address) {
               try {
                 const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                 const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                 const [balance, tokensStaked3Months] = await Promise.all([
                   tokenContract.balanceOf(address),
                   tokenContract.tokensStaked3Months(address),
                 ]);

                 const available = balance.sub(tokensStaked3Months);
                 // Format balance and set it to 2 decimal places
                 const formattedAvailable = ethers.utils.formatUnits(available, 'ether');
                 setAvailableBalance3Months(parseFloat(formattedAvailable).toFixed(0)); // Now the balance is a string with 2 decimal places
               } catch (error) {
                 console.error('Error fetching balances:', error);
                 setAvailableBalance3Months('Error');
               }
             }
           };

           fetchBalances3Months();
         }, [address]); // Fetch when the address changes



           const [unlockTime3Months, setUnlockTime3Months] = useState('Loading...');

           useEffect(() => {
             const fetchUnlockTime3Months = async () => {
               if (address) {
                 try {
                   const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                   const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                   const stakedTimestamp3Months = await tokenContract._staked3MonthsTimestamp(address);
                   const currentBlock = await provider.getBlock('latest');
                   const currentTime = currentBlock.timestamp;

                   const timeDiff = stakedTimestamp3Months - currentTime;
                   if (timeDiff <= 0) {
                     setUnlockTime3Months('Unlocked');
                     return;
                   }

                   const days = Math.floor(timeDiff / (24 * 3600));
                   const hours = Math.floor((timeDiff % (24 * 3600)) / 3600);
                   const minutes = Math.floor((timeDiff % 3600) / 60);
                   const seconds = Math.floor(timeDiff % 60);

                   setUnlockTime3Months(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
                 } catch (error) {
                   console.error('Error fetching unlock time:', error);
                   setUnlockTime3Months('Error');
                 }
               }
             };

             fetchUnlockTime3Months();
           }, [address]);



           const [stakedTimestamp3Months, setStakedTimestamp3Months] = useState('Loading...');

           useEffect(() => {
             const fetchStakedTimestamp3Months = async () => {
               if (address) {
                 try {
                   const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                   const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                   const timestamp = await tokenContract._staked3MonthsTimestamp(address);
                   const date = new Date(timestamp.toNumber() * 1000).toLocaleString(); // Convert timestamp to readable date
                   setStakedTimestamp3Months(date);
                 } catch (error) {
                   console.error('Error fetching staked timestamp:', error);
                   setStakedTimestamp3Months('Error');
                 }
               }
             };

             fetchStakedTimestamp3Months();
           }, [address]);


           const [stakedBlockNumber3Months, setStakedBlockNumber3Months] = useState('Loading...');

           useEffect(() => {
            const fetchStakedBlockNumber3Months = async () => {
              if (address) {
                try {
                  const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                  const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                  const stakedTimestamp3MonthsBN = await tokenContract._staked3MonthsTimestamp(address);
                  const stakedTimestamp3Months = stakedTimestamp3MonthsBN.toNumber();

                  const currentBlock = await provider.getBlock('latest');
                  const currentTimestamp = currentBlock.timestamp;
                  const currentBlockNumber = currentBlock.number;

                  // Estimate the block number of the staked timestamp
                  const blockDifference = (stakedTimestamp3Months - currentTimestamp) / BLOCK_RATE_SECONDS;
                  const estimatedStakedBlockNumber3Months = currentBlockNumber + Math.round(blockDifference);

                  setStakedBlockNumber3Months(estimatedStakedBlockNumber3Months.toString());
                } catch (error) {
                  console.error('Error fetching staked block number:', error);
                  setStakedBlockNumber3Months('Error');
                }
              }
            };

            fetchStakedBlockNumber3Months();
          }, [address]);

            const [unlockDate3Months, setUnlockDate3Months] = useState('Loading...');

            useEffect(() => {
             const fetchUnlockDate3Months = async () => {
               if (address) {
                 try {
                   const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                   const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                   const stakedTimestamp3MonthsBN = await tokenContract._staked3MonthsTimestamp(address);
                   const stakedTimestamp3Months = stakedTimestamp3MonthsBN.toNumber();

                   // Add 30 days to the staked timestamp
                   const unlockTime3Monthsstamp = new Date(stakedTimestamp3Months * 1000);
                   unlockTime3Monthsstamp.setDate(unlockTime3Monthsstamp.getDate() + 90);

                   setUnlockDate3Months(unlockTime3Monthsstamp.toLocaleDateString());
                 } catch (error) {
                   console.error('Error fetching unlock date:', error);
                   setUnlockDate3Months('Error');
                 }
               }
             };

             fetchUnlockDate3Months();
           }, [address]);


    // ######################################################################################################################################################################


        // ######################################################################################################################################################################
            // 6month
        // ##################################
        // unstake tokens 6month
        // ##################################

            const { writeAsync: Unstake6Months } = useContractWrite({
              ...tokenContractConfig,
              functionName: 'Unstake6Months',
            });
            const onUnstake6MonthsClick = async () => {
              try {
                const tx = await Unstake6Months();
                await tx.wait();
                toast.success('Unstaking successful!');
              } catch (error) {
                console.error(error);
                toast.error('Unstaking failed. Please Check your Unlock Date in dapp.');
              }
            };


            // ##################################
                // State for staking amount
                // ##################################
                 const [stakeAmount6Months, setStakeAmount6Months] = useState('');

                 // Contract write hook for staking in the token contract
                 const { writeAsync: stakeFor6Months } = useContractWrite({
                   ...tokenContractConfig,
                   functionName: 'StakeFor6Months',
                 });

                 // Function to handle staking
                 const onStakeClick6Months = async () => {
                   try {
                     if (!stakeAmount6Months) {
                       toast.error('Please enter an amount to stake.');
                       return;
                     }

                     // Convert the stake amount to Wei
                     const stakeAmount6MonthsInWei = ethers.utils.parseUnits(stakeAmount6Months, 'wei');

                     // Call the StakeFor6Months function in the contract
                     const tx = await stakeFor6Months({
                       args: [stakeAmount6MonthsInWei],
                     });

                     await tx.wait();
                     toast.success('Staking successful!');
                   } catch (error) {
                     console.error(error);
                     toast.error('Staking failed. Please try again.');
                   }
                 };

        // ##################################
          // is the user staked
          // ##################################


            const [userStaked6Months, setUserStaked6Months] = useState('Loading...');

            useEffect(() => {
             const fetchUserStaked6MonthsStatus = async () => {
               if (address) {
                 try {
                   const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                   const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                   const isStaked = await tokenContract._isStaked6Months(address);
                   setUserStaked6Months(isStaked.toString());
                 } catch (error) {
                   console.error('Error fetching staking status:', error);
                   setUserStaked6Months('Error');
                 }
               }
             };

             fetchUserStaked6MonthsStatus();
           }, [address]); // Fetch staking status when the address changes






             // amount staked 3 month pool
               const [tokensStaked6Months, setTokensStaked6Months] = useState('Loading...');

               useEffect(() => {
                  const fetchTokensStaked6Months = async () => {
                    if (address) {
                      try {
                        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                        const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                        const tokens = await tokenContract.tokensStaked6Months(address);
                        setTokensStaked6Months(ethers.utils.formatUnits(tokens, 'ether')); // Adjust based on your token's decimals
                      } catch (error) {
                        console.error('Error fetching tokens staked for 1 month:', error);
                        setTokensStaked6Months('Error');
                      }
                    }
                  };

                  fetchTokensStaked6Months();
                }, [address]); // Fetch when the address changes


             // available balance after staking locks
             const [availableBalance6Months, setAvailableBalance6Months] = useState('Loading...');

             useEffect(() => {
               const fetchBalances6Months = async () => {
                 if (address) {
                   try {
                     const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                     const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                     const [balance, tokensStaked6Months] = await Promise.all([
                       tokenContract.balanceOf(address),
                       tokenContract.tokensStaked6Months(address),
                     ]);

                     const available = balance.sub(tokensStaked6Months);
                     // Format balance and set it to 2 decimal places
                     const formattedAvailable = ethers.utils.formatUnits(available, 'ether');
                     setAvailableBalance6Months(parseFloat(formattedAvailable).toFixed(0)); // Now the balance is a string with 2 decimal places
                   } catch (error) {
                     console.error('Error fetching balances:', error);
                     setAvailableBalance6Months('Error');
                   }
                 }
               };

               fetchBalances6Months();
             }, [address]); // Fetch when the address changes



               const [unlockTime6Months, setUnlockTime6Months] = useState('Loading...');

               useEffect(() => {
                 const fetchUnlockTime6Months = async () => {
                   if (address) {
                     try {
                       const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                       const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                       const stakedTimestamp6Months = await tokenContract._staked6MonthsTimestamp(address);
                       const currentBlock = await provider.getBlock('latest');
                       const currentTime = currentBlock.timestamp;

                       const timeDiff = stakedTimestamp6Months - currentTime;
                       if (timeDiff <= 0) {
                         setUnlockTime6Months('Unlocked');
                         return;
                       }

                       const days = Math.floor(timeDiff / (24 * 3600));
                       const hours = Math.floor((timeDiff % (24 * 3600)) / 3600);
                       const minutes = Math.floor((timeDiff % 3600) / 60);
                       const seconds = Math.floor(timeDiff % 60);

                       setUnlockTime6Months(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
                     } catch (error) {
                       console.error('Error fetching unlock time:', error);
                       setUnlockTime6Months('Error');
                     }
                   }
                 };

                 fetchUnlockTime6Months();
               }, [address]);



               const [stakedTimestamp6Months, setStakedTimestamp6Months] = useState('Loading...');

               useEffect(() => {
                 const fetchStakedTimestamp6Months = async () => {
                   if (address) {
                     try {
                       const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                       const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                       const timestamp = await tokenContract._staked6MonthsTimestamp(address);
                       const date = new Date(timestamp.toNumber() * 1000).toLocaleString(); // Convert timestamp to readable date
                       setStakedTimestamp6Months(date);
                     } catch (error) {
                       console.error('Error fetching staked timestamp:', error);
                       setStakedTimestamp6Months('Error');
                     }
                   }
                 };

                 fetchStakedTimestamp6Months();
               }, [address]);


               const [stakedBlockNumber6Months, setStakedBlockNumber6Months] = useState('Loading...');

               useEffect(() => {
                const fetchStakedBlockNumber6Months = async () => {
                  if (address) {
                    try {
                      const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                      const stakedTimestamp6MonthsBN = await tokenContract._staked6MonthsTimestamp(address);
                      const stakedTimestamp6Months = stakedTimestamp6MonthsBN.toNumber();

                      const currentBlock = await provider.getBlock('latest');
                      const currentTimestamp = currentBlock.timestamp;
                      const currentBlockNumber = currentBlock.number;

                      // Estimate the block number of the staked timestamp
                      const blockDifference = (stakedTimestamp6Months - currentTimestamp) / BLOCK_RATE_SECONDS;
                      const estimatedStakedBlockNumber6Months = currentBlockNumber + Math.round(blockDifference);

                      setStakedBlockNumber6Months(estimatedStakedBlockNumber6Months.toString());
                    } catch (error) {
                      console.error('Error fetching staked block number:', error);
                      setStakedBlockNumber6Months('Error');
                    }
                  }
                };

                fetchStakedBlockNumber6Months();
              }, [address]);

                const [unlockDate6Months, setUnlockDate6Months] = useState('Loading...');

                useEffect(() => {
                 const fetchUnlockDate6Months = async () => {
                   if (address) {
                     try {
                       const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                       const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                       const stakedTimestamp6MonthsBN = await tokenContract._staked6MonthsTimestamp(address);
                       const stakedTimestamp6Months = stakedTimestamp6MonthsBN.toNumber();

                       // Add 30 days to the staked timestamp
                       const unlockTime6Monthsstamp = new Date(stakedTimestamp6Months * 1000);
                       unlockTime6Monthsstamp.setDate(unlockTime6Monthsstamp.getDate() + 180);

                       setUnlockDate6Months(unlockTime6Monthsstamp.toLocaleDateString());
                     } catch (error) {
                       console.error('Error fetching unlock date:', error);
                       setUnlockDate6Months('Error');
                     }
                   }
                 };

                 fetchUnlockDate6Months();
               }, [address]);


// ######################################################################################################################################################################


  // Calculate total staked across all periods and format it
  const totalStakedAllPeriods = (
    parseFloat(tokensStaked1Month) +
    parseFloat(tokensStaked3Months) +
    parseFloat(tokensStaked6Months)
  ).toFixed(0); // Converts to string with 3 decimal places


  // useState import statement is assumed to be already there
  const [dividendBalance, setDividendBalance] = useState('Loading...');

  useEffect(() => {
    const fetchDividendBalance = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request user's account access
          const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);

          const address = await signer.getAddress();
          const balance = await contract.dividendTokenBalanceOf(address);
          // Assuming the balance is returned in wei, convert it to ether
          const balanceInEther = ethers.utils.formatEther(balance);
          setDividendBalance(`${parseFloat(balanceInEther).toFixed(0)}`); // Format the balance to no decimal places

        } catch (err) {
          console.error('Failed to load dividend balance:', err);
          setDividendBalance('Failed to load');
        }
      } else {
        setDividendBalance('Ethereum object not found');
      }
    };

    fetchDividendBalance();
  }, []); // This effect does not depend on any changing values and thus runs only on component mount





  // Function to handle clicking the Max button
  const handleMaxClick = () => {
    // Convert availableBalance to a number, round it down to the nearest whole number, and then set it as the new stakeAmount
    const maxStakeAmount = Math.floor(Number(availableBalance)).toString();
    setStakeAmount(maxStakeAmount);
  };





// ####################################################################################################################################
// ####################################################################################################################################
// ####################################################################################################################################

const [totalSupply, setTotalSupply] = useState('Loading...');

useEffect(() => {
const fetchTotalSupply = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
    try {
      await provider.send("eth_requestAccounts", []);
      const contract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);
      const supply = await contract.totalSupply();
      const supplyInEther = ethers.utils.formatEther(supply);
      const supplyRounded = parseFloat(supplyInEther).toFixed(0);
      const supplyFormatted = parseInt(supplyRounded, 10).toLocaleString('en-US');
      setTotalSupply(supplyFormatted);
    } catch (error) {
      console.error("Error fetching total supply:", error instanceof Error ? error.message : error);
      setTotalSupply(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    setTotalSupply('Ethereum object not found. Please install MetaMask.');
  }
};

fetchTotalSupply();
}, []);






    // ####################################################################################################################################
    // ####################################################################################################################################
    // ####################################################################################################################################




  return (
      <>
      <ToastContainer />
        <Box p={4} color="white" bg="black">
          <Flex justifyContent="space-between" alignItems="center">
            <Text style={headerTextStyle}>Power of 3 Dapp</Text>
            <ConnectButton />
          </Flex>
        </Box>

        <Box p={0}  bg="black" >
        <Container maxW="container.xl" p={4} color="white">
          <Flex direction="column" gap={4}>

                      <Box minH="270px" bg="black" p={4} borderRadius="lg">

                          <img src={pw3Logo} alt="Main Text Logo" className="logobody" />

                          <div style={{ fontSize: '48px', fontWeight: 'bolder', textAlign: 'center', marginTop: '8px', marginBottom: '20px' }}>
                              Power of 3
                          </div>
                      </Box>




                                                          {/* Adjusted Flex container for equal height columns */}
                                                          <Flex direction={{ base: "column", md: "row" }} gap={4}>
                                                            <Box flex={1} bg="gray.800" p={4} display="flex" flexDirection="column" borderRadius="lg">

                                                                                  <img src={tokenLogo} alt="Main Text Logo" className="logobody" />


                                                                                                                                                                                        <div style={{ fontSize: '20px', fontWeight: 'bolder', textAlign: 'center', marginBottom: '30px', marginTop: '30px' }}>
                                                                  Power Surge
                                                              </div>

                                                              {/* Mint NFT Section */}
                                              <Box flex={1} bg="gray.800" p={4} display="flex" flexDirection="column">
                                                <VStack spacing={4}>
                                                  <div style={{ fontSize: '16px', fontWeight: 'bolder', marginBottom: '0px' }}>
                                                    PST: ${tokenPriceUSD}
                                                  </div>
                                                <div style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px' }}>
                                                    0x3e69ba6dd72e39a1694b85775944f713fe0a0e9b
                                                </div>


                                                </VStack>
                                              </Box>
                                                            </Box>

                                                          <Box  flex={1} bg="gray.800" p={4} display="flex" flexDirection="column" borderRadius="lg">

                                                                                <img src={anuLogo} alt="Main Text Logo" className="logobody"  />


                                                                                                                <div style={{ fontSize: '20px', fontWeight: 'bolder', textAlign: 'center', marginBottom: '30px', marginTop: '30px' }}>
                                                                                                                    Anunaki
                                                                                                                </div>

                                                                                                                {/* Mint NFT Section */}
                                                                                                <Box flex={1} bg="gray.800" p={4} display="flex" flexDirection="column">
                                                                                                  <VStack spacing={4}>

                                                                                                    <div style={{ fontSize: '16px', fontWeight: 'bolder', marginBottom: '0px' }}>
                                                                                                      ANU: ${anuPriceUSD}
                                                                                                    </div>
                                                                                                  <div style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px' }}>
                                                                                                      0x6CB6c8D16e7B6Fd5A815702B824e6Dfdf148a7D9
                                                                                                  </div>

                                                </VStack>
                                              </Box>

                                                          </Box>


                                                            <Box flex={1} bg="gray.800" p={4} display="flex" flexDirection="column" borderRadius="lg">

                                                                                  <img src={btmLogo} alt="Main Text Logo" className="logobody" />

                                                                                                                                                                                        <div style={{ fontSize: '20px', fontWeight: 'bolder', textAlign: 'center', marginBottom: '30px', marginTop: '30px' }}>
                                                                                                                      Bitmaxx
                                                                                                                  </div>

                                                                                                                  {/* Mint NFT Section */}
                                                                                                  <Box flex={1} bg="gray.800" p={4} display="flex" flexDirection="column">
                                                                                                    <VStack spacing={4}>

                                                                                                      <div style={{ fontSize: '16px', fontWeight: 'bolder', marginBottom: '0px' }}>
                                                                                                        BTM: ${btmPriceUSD}
                                                                                                      </div>
                                                                                                    <div style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px' }}>
                                                                                                        0xc27BbD4276F9eb2D6F2c4623612412d52D7Bb43D
                                                                                                    </div>


                                                </VStack>
                                              </Box>
                                                            </Box>

                                                          </Flex>



                                                                      <Box minH="20px" bg="gray.800" p={4} borderRadius="lg">


                                                                                    <div style={{ fontSize: '32px', fontWeight: 'bolder', textAlign: 'center', marginTop: '8px', marginBottom: '20px' }}>
                                                                                        Power Surge Token
                                                                                    </div>
                                                                                </Box>




                                                                      <Flex wrap="wrap" justifyContent="space-between" alignItems="center">
                                                                        <Box flex="1" minW="160px" bg="gray.800" p={4} m={2} textAlign="center" borderRadius="lg">
                                                                          <div style={{ fontSize: '16px', fontWeight: 'bolder', marginBottom: '0px' }}>
                                                                            Market Cap
                                                                          </div>
                                                                          <div style={{ fontSize: '16px', fontWeight: 'bolder', marginBottom: '0px' }}>
                                                                            {marketCap}
                                                                          </div>
                                                                        </Box>
                                                                        <Box flex="1" minW="240px" bg="gray.800" p={4} m={2} textAlign="center" borderRadius="lg">
                                                                          <div style={{ fontSize: '16px', fontWeight: 'bolder', marginBottom: '0px' }}>
                                                                            Liquidity
                                                                          </div>
                                                                          <div style={{ fontSize: '16px', fontWeight: 'bolder', marginBottom: '0px' }}>
                                                                            {totalLiquidityUSD}
                                                                          </div>
                                                                        </Box>
                                                                        <Box flex="1" minW="240px" bg="gray.800" p={4} m={2} textAlign="center" borderRadius="lg">
                                                                          <div style={{ fontSize: '16px', fontWeight: 'bolder', marginBottom: '0px' }}>
                                                                           Initial Supply
                                                                          </div>
                                                                          <div style={{ fontSize: '16px', fontWeight: 'bolder', marginBottom: '0px' }}>
                                                                            100,000,000
                                                                          </div>
                                                                        </Box>
                                                                        <Box flex="1" minW="240px" bg="gray.800" p={4} m={2} textAlign="center" borderRadius="lg">
                                                                          <div style={{ fontSize: '16px', fontWeight: 'bolder', marginBottom: '0px' }}>
                                                                           Remaining Supply
                                                                          </div>
                                                                          <div style={{ fontSize: '16px', fontWeight: 'bolder', marginBottom: '0px' }}>
                                                                            {totalSupply}
                                                                          </div>
                                                                        </Box>
                                                                      </Flex>






            {/* Adjusted Flex container for equal height columns */}
            <Flex direction={{ base: "column", md: "row" }} gap={4}>

            <Box
                 flex={1}
                 p={4}
                 display="flex"
                 flexDirection="column"
                 borderRadius="lg"
                 bg="gray.800"
                 bgImage={`url(${backgroundImage})`}
                 bgPosition="center"
                 bgRepeat="no-repeat"
                 bgSize="cover"
               >
                 <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginTop: '220px' }}>
                   Your Power Surge (PST) Token Statistics
                 </div>


                               <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4' >

                               <div style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                               Available Balance: {availableBalance} Tokens
                               </div>
                               <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                                Your Total Token Balance: {tokenBalance}
                                </div>
                               <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                               Your Total Staked Balance: {totalStakedAllPeriods}
                               </div>


                             <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px' }}>
                             Current Staking Boost
                             </div>

                                <div>

                                <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                                {
                                  tokenBalance !== 'Loading...' && dividendBalance !== 'Loading...' && parseFloat(tokenBalance) !== 0
                                  ? (parseFloat(dividendBalance) / parseFloat(tokenBalance)).toFixed(3)
                                  : 'N/A'
                                }x  Reflections Multiplier
                                </div>
                                </div>






                                 <a href="https://maxxswap.org/#/swap?outputCurrency=0x3e69bA6Dd72e39A1694B85775944f713Fe0a0e9B&inputCurrency=ETH"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   style={{
                                     padding: '8px 16px',
                                     fontSize: '16px',
                                     fontWeight: 'bold',
                                     color: 'white',
                                     backgroundColor: 'blue',
                                     textDecoration: 'none',
                                     textAlign: 'center',
                                     borderRadius: '4px',
                                     display: 'inline-block'
                                   }}
                                   onMouseOver={(e) => {
                                     e.currentTarget.style.backgroundColor = '#0000ff'; // Darker blue on hover
                                   }}
                                   onMouseOut={(e) => {
                                     e.currentTarget.style.backgroundColor = 'blue'; // Original blue
                                   }}
                                 >
                                   Buy Now
                                 </a>

                               </Box>
               </Box>


















                           <Box
                                flex={1}
                                p={4}
                                display="flex"
                                flexDirection="column"
                                borderRadius="lg"
                                bg="gray.800"
                                bgPosition="center"
                                bgRepeat="no-repeat"
                                bgSize="cover"
                              >
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
                      <Box
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                        marginTop='4'
                        style={{ backgroundColor: '' }} // Light dark grey color
                        >

                        <div style={{ fontSize: '42px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                          30 Day Staking Pool
                        </div>

                        <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                        Receive 2x Reflections on staked tokens in this pool
                        </div>

{/* Staking Section */}
<Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4'>
<Flex alignItems="center" justifyContent="center" marginTop="4">
  <Input
    placeholder='Enter amount to stake'
    value={stakeAmount}
    onChange={(e) => setStakeAmount(e.target.value)}
    size='md'
    bg="white"
    color="black"
    borderColor="gray.990"
    type="number"
  />
  <Button
    onClick={handleMaxClick}
    ml="2" // Margin left for spacing
    bg='gray.600'
    _hover={{ bg: 'gray.500' }}
  >
    Max
  </Button>
</Flex>
<Button
onClick={onStakeClick}
marginTop='2'
textColor='white'
bg='Blue'
_hover={{ bg: 'Blue' }}
>
Stake for 30 Days
</Button>
</Box>
{/* Unstake Section */}
<Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4'marginBottom='4'>
<Button
onClick={onUnstake1MonthClick}
textColor='white'
bg='Blue'
_hover={{ bg: 'Blue' }}
>
Unstake
</Button>
</Box>


                    <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginTop: '5px'}}>
                                        Your Tokens Staked for 1 Month: {tokensStaked1Month}
                                        </div>

                                                            <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginTop: '15px' }}>
                                                            Staked on: {stakedTimestamp}
                                                            </div>

                                                                                <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px' }}>
                                                                                Unlock Date: {unlockDate}
                                                                                </div>

</Box>
                      </Box>
                    </TabPanel>
                      <TabPanel>
                        <Box minH="350px">
                        <Box
                          display='flex'
                          flexDirection='column'
                          alignItems='center'
                          justifyContent='center'
                          marginTop='4'
                          style={{ backgroundColor: '' }} // Light dark grey color
                          >

                                                  <div style={{ fontSize: '42px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                            90 Day Staking Pool
                          </div>

                          <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                          Receive 4x Reflections on staked tokens in this pool
                          </div>

                    {/* Staking Section */}
                    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4'>
                    <Flex alignItems="center" justifyContent="center" marginTop="4">
                      <Input
                        placeholder='Enter amount to stake 90 Days'
                        value={stakeAmount3Months}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        size='md'
                        bg="white"
                        color="black"
                        borderColor="gray.990"
                        type="number"
                        // Convert availableBalance to a number before using Math.floor
                        max={Math.floor(+availableBalance).toString()} // Convert to string after calculation
                      />
                      <Button
                        onClick={() => setStakeAmount3Months(Math.floor(+availableBalance).toString())} // Convert to number, then back to string
                        ml="2"
                        bg='gray.600'
                        _hover={{ bg: 'gray.500' }}
                      >
                        Max
                      </Button>
                    </Flex>

                    <Button
                    onClick={onStakeClick3Months}
                    marginTop='2'
                    textColor='white'
                    bg='Blue'
                    _hover={{ bg: 'Blue' }}
                    >
                    Stake for 90 Days
                    </Button>
                    </Box>
                    {/* Unstake Section */}
                    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4' marginBottom='4' >
                    <Button
                    onClick={onUnstake3MonthsClick}
                    textColor='white'
                    bg='Blue'
                    _hover={{ bg: 'Blue' }}
                    >
                    Unstake
                    </Button>
                    </Box>

                    <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginTop: '5px' }}>
                    Your Tokens Staked for 3 Month: {tokensStaked3Months}
                    </div>


                                        <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginTop: '15px' }}>
                    Staked on: {stakedTimestamp3Months}
                    </div>

                    <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px' }}>
                    Unlock Date: {unlockDate3Months}
                    </div>










                    </Box>
                        </Box>
                      </TabPanel>
                        <TabPanel>
                          <Box minH="350px">
                          <Box
                            display='flex'
                            flexDirection='column'
                            alignItems='center'
                            justifyContent='center'
                            marginTop='4'
                            style={{ backgroundColor: '' }} // Light dark grey color
                            >

                                                    <div style={{ fontSize: '42px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                              180 Day Staking Pool
                            </div>

                            <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                            Receive 8x Reflections on staked tokens in this pool
                            </div>


                      {/* Staking Section */}
                      <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4'>
                      <Flex alignItems="center" justifyContent="center" marginTop="4">
            <Input
              placeholder='Enter amount to stake 180 Days'
              value={stakeAmount6Months}
              onChange={(e) => setStakeAmount(e.target.value)}
              size='md'
              bg="white"
              color="black"
              borderColor="gray.990"
              type="number"
              // Convert availableBalance to a number before using Math.floor
              max={Math.floor(+availableBalance).toString()} // Convert to string after calculation
            />
            <Button
              onClick={() => setStakeAmount6Months(Math.floor(+availableBalance).toString())} // Convert to number, then back to string
              ml="2"
              bg='gray.600'
              _hover={{ bg: 'gray.500' }}
            >
              Max
            </Button>
          </Flex>
                      <Button
                      onClick={onStakeClick6Months}
                      marginTop='2'
                      textColor='white'
                      bg='Blue'
                      _hover={{ bg: 'Blue' }}
                      >
                      Stake for 180 Days
                      </Button>
                      </Box>
                      {/* Unstake Section */}
                      <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4' marginBottom='4' >
                      <Button
                      onClick={onUnstake6MonthsClick}
                      textColor='white'
                      bg='Blue'
                      _hover={{ bg: 'Blue' }}
                      >
                      Unstake
                      </Button>
                      </Box>

                      <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginTop: '5px' , }}>
                      Your Tokens Staked for 6 Month: {tokensStaked6Months}
                      </div>

                                          <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginTop: '15px' }}>
                      Staked on: {stakedTimestamp6Months}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px' }}>
                      Unlock Date: {unlockDate6Months}
                      </div>

                      </Box>
                          </Box>
                        </TabPanel>
                    <TabPanel>
                      <Box minH="350px">

                                                                                {/* Claim Section */}
                                                                              <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4'>

                                                                                Add More stuff to the More TAB
                                                                                <Button
                                                                                  onClick={onClaimClick}
                                                                                  textColor='white'
                                                                                  bg='blue'
                                                                                  _hover={{ bg: 'blue' }}
                                                                                >
                                                                                  Claim Tokens
                                                                                </Button>



                          {rewardsToClaim}
                                                                              </Box>
<Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4'>

                          <Button
                           onClick={addTokenToWallet}
                           textColor='white'
                           bg='blue'
                           _hover={{ bg: 'blue' }}
                         >

                            Add PST to Wallet
                          </Button>

                                                                              </Box>
<Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4'>

                                                    <Button
                                                     onClick={copyToClipboard}
                                                     textColor='white'
                                                     bg='blue'
                                                     _hover={{ bg: 'blue' }}
                                                   >
                                                     Copy
                                                    </Button>
                                                    {copySuccess && <div>{copySuccess}</div>}
                                                                              </Box>

                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px' }}>
                                                                             Balance of dividend tokens {dividendBalance} PSTTRACKER Token
                                                                             </div>
                                                                                           <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px' }}>
                                                                                           Available Balance: {availableBalance} Tokens
                                                                                           </div>
                      </Box>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Flex>



            <Box minH="500px" bg="grey.700">


          <iframe  height="490px" width="100%" id="geckoterminal-embed" title="GeckoTerminal Embed" src="https://www.geckoterminal.com/maxxchain/pools/0x65011afc895f47d6bc2b190b6993dfc8cd415839?embed=1&info=0&swaps=0" frameBorder="0" allowFullScreen></iframe>



            </Box>





          </Flex>
        </Container>


        </Box>
        <Box p={4} color="white" bg="black" textAlign="center">
          © InHaus Development 2024
        </Box>
      </>
    );
  };

  export default App;



            //
            //             <Box minH="100px" bg="gray.800" p={4} borderRadius="lg">
            //
            //             <img src={tokenLogo} alt="Main Text Logo" className="logobody" />
            //
            //
            //                           <div style={{ fontSize: '48px', fontWeight: 'bolder', textAlign: 'center', marginBottom: '0px' }}>
            //               Power Surge
            //             </div>
            //                           <div style={{ fontSize: '16px', fontWeight: 'bolder', textAlign: 'center', marginBottom: '0px' }}>
            //               Rewards Dapp on Maxx Chain
            //             </div>
            //                       </Box>
            // <Box minH="200px" bg="gray.800" p={4} borderRadius="lg">
            //
            //
            //               <div style={{ fontSize: '16px', fontWeight: 'normal', textAlign: 'center', marginBottom: '20px' }}>
            //
            //   </div>
            //
            //   <div style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
            //        Current Market Cap: {marketCap}
            //        </div>
            //   <div style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
            //        Total Liquidity: {totalLiquidityUSD} USD Value</div>
            //
            //
            //   <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '2px' }}>
            //        Starting Supply: {INITIAL_SUPPLY.toLocaleString()}
            //   </div>
            //   <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '2px' }}>
            //        Tokens Destroyed: 00000
            //   </div>
            //   <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginBottom: '2px' }}>
            //        Remaining Supply: {totalSupply}
            //   </div>
            //
            //
            //
            //
            //
            // </Box>




                                                                                //
                                                                                //   <Box minH="20px" bg="gray.800" p={4} borderRadius="lg">
                                                                                //
                                                                                // <div style={{ fontSize: '16px', fontWeight: 'normal', textAlign: 'center', marginBottom: '20px' }}>
                                                                                //   Token Information on selected token, sort of an itro for sean to provide for each token used
                                                                                //   </div>
                                                                                //
                                                                                //   </Box>
                                                                                //
                                                                                //
                                                                                //


                                          //   <Box flex="1" minW="240px" bg="gray.800" p={4} m={2} textAlign="center" borderRadius="lg">
                                          //     <div style={{ fontSize: '16px', fontWeight: 'bolder', marginBottom: '0px' }}>
                                          //       PWR: ${pwrPriceUSD}
                                          //     </div>
                                          //   </Box>


                                          //             <Box minH="200px" bg="gray.800" p={4} borderRadius="lg">
                                          //
                                          //           <div style={{ fontSize: '16px', fontWeight: 'normal', textAlign: 'center', marginBottom: '20px' }}>
                                          //             Multiple Staking Lock Periods: Choose from 30-day, 90-day, and 180-day lock periods to stake your tokens.
                                          //             Token Statistics: View detailed statistics of your tokens, including available, staked, and total balances.
                                          //             Total Statistics: Access aggregated statistics to understand the overall staking landscape.
                                          //             Liquidity Pools Tracker: Monitor the value of the token's LP and other pools directly from the DApp.
                                          //             Swapper DApp: Easily buy the DApp's token with the native currency or sell it back to the native currency without affecting the network's value stability.
                                          //             NFT Minting: Projects with NFT collections can utilize our DApp for their minting process.
                                          //             Comprehensive Token Information: Find all the information about the token, including its utility, benefits, and roadmap.
                                          //             Live Price Data: Stay updated with live price data for both the DApp's token and the native currency.
                                          //             </div>
                                          //
                                          //             </Box>
                                          //
                                          //
                                          //
                                          //             {/* Adjusted Flex container for equal height columns */}
                                          //             <Flex direction={{ base: "column", md: "row" }} gap={4}>
                                          //
                                          //             <Box  flex={1} bg="gray.300" p={4} display="flex" flexDirection="column" borderRadius="lg">
                                          //               Mint NFT section collection 1
                                          //
                                          //               {/* Mint NFT Section */}
                                          // <Box flex={1} bg="gray.800" p={4} display="flex" flexDirection="column">
                                          //   <VStack spacing={4}>
                                          // <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
                                          //   <Button
                                          //     marginTop='1'
                                          //     textColor='white'
                                          //     bg='#058ba1'
                                          //     _hover={{
                                          //       bg: '#4d9795',
                                          //     }}
                                          //     onClick={handleDecrement}
                                          //     disabled={!isConnected || mintLoading || mintAmount === 1}
                                          //   >
                                          //     -
                                          //   </Button>
                                          //   <Text marginX='3' textAlign='center' fontSize='lg'>
                                          //     {mintAmount}
                                          //   </Text>
                                          //   <Button
                                          //     marginTop='1'
                                          //     textColor='white'
                                          //     bg='#058ba1'
                                          //     _hover={{
                                          //       bg: '#4d9795',
                                          //     }}
                                          //     onClick={handleIncrement}
                                          //     disabled={!isConnected || mintLoading || mintAmount === 200}
                                          //   >
                                          //     +
                                          //   </Button>
                                          // </Box>
                                          // <Box marginTop='2' display='flex' alignItems='center' justifyContent='center'>
                                          //   <Button
                                          //     disabled={!isConnected || mintLoading}
                                          //     marginTop='6'
                                          //     onClick={onMintClick}
                                          //     textColor='white'
                                          //     bg='#058ba1'
                                          //     _hover={{
                                          //       bg: '#4d9795',
                                          //     }}
                                          //   >
                                          //     {isConnected ? `Mint ${mintAmount} Now` : ' Mint on (Connect Wallet)'}
                                          //   </Button>
                                          // </Box>
                                          //   </VStack>
                                          // </Box>
                                                      //
                                                      // </Box>
                                          //
                                          //
                                          //
                                          //             </Flex>
