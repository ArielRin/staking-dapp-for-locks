
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

const CONTRACT_ADDRESS = '0xaddresshere';
const TOKEN_ADDRESS = '0x3e69bA6Dd72e39A1694B85775944f713Fe0a0e9B'; //og lastman

const getExplorerLink = () => `https://bscscan.com/address/${CONTRACT_ADDRESS}`;
const BLOCK_RATE_SECONDS = 3; // BSC block rate


const App = () => {


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
    const [totalSupply, setTotalSupply] = useState(0);
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
              const provider = new ethers.providers.Web3Provider(window.ethereum);
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










  // Function to handle adding token to MetaMask
  const handleAddToken = async () => {
    if (window.ethereum) {
      try {
        // MetaMask request to watch the asset
        await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // Use 'ERC721' for NFTs
            options: {
              address: TOKEN_ADDRESS, // The address that the token is at
              symbol: 'LASTMAN', // A ticker symbol or shorthand, up to 5 characters
              decimals: 18, // The number of decimals in the token
              image: tokenSvg, // A string url of the token logo
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('MetaMask is not installed!');
    }
  };










  //fetch token pricePerToken in usd
  const [tokenPriceUSD, setTokenPriceUSD] = useState('Loading...');
    const tokenAddress = '0xa7efd5d0575cd4682b0c83155bb9e4ff1a85a6f9'; // Your token address

    useEffect(() => {
      const url = `https://api.geckoterminal.com/api/v2/simple/networks/bsc/token_price/${tokenAddress}`;

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

    const [xrpPriceUSD, setXrpPriceUSD] = useState('Loading...');
   const xrpTokenAddress = '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe'; // XRP token address on BSC

   useEffect(() => {
     const url = `https://api.geckoterminal.com/api/v2/simple/networks/bsc/token_price/${xrpTokenAddress}`;

     fetch(url)
       .then(response => response.json())
       .then(data => {
         if (data && data.data && data.data.attributes && data.data.attributes.token_prices) {
           const price = data.data.attributes.token_prices[xrpTokenAddress];
           setXrpPriceUSD(`${parseFloat(price).toFixed(6)} USD`); // Format the price to 6 decimal places
         } else {
           setXrpPriceUSD('Price not available');
         }
       })
       .catch(error => {
         console.error('Error fetching XRP price:', error);
         setXrpPriceUSD('Error fetching price');
       });
   }, []);

   const [bnbPriceUSD, setBnbPriceUSD] = useState('Loading...');
  const bnbTokenAddress = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'; // BNB token address on BSC

  useEffect(() => {
    const url = `https://api.geckoterminal.com/api/v2/simple/networks/bsc/token_price/${bnbTokenAddress}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.data && data.data.attributes && data.data.attributes.token_prices) {
          const price = data.data.attributes.token_prices[bnbTokenAddress];
          setBnbPriceUSD(`${parseFloat(price).toFixed(2)} USD`); // Format the price to 6 decimal places
        } else {
          setBnbPriceUSD('Price not available');
        }
      })
      .catch(error => {
        console.error('Error fetching BNB price:', error);
        setBnbPriceUSD('Error fetching price');
      });
  }, []);

  const [rewardsValueInUSD, setRewardsValueInUSD] = useState('Loading...');

    useEffect(() => {
      // Calculate rewards in USD
      const xrpPrice = parseFloat(xrpPriceUSD.replace(' USD', ''));
      const rewardsAmount = parseFloat(rewardsToClaim);

      if (!isNaN(xrpPrice) && !isNaN(rewardsAmount)) {
        const calculatedValue = (rewardsAmount * xrpPrice).toFixed(2); // Format the result to 2 decimal places
        setRewardsValueInUSD(`${calculatedValue} USD`);
      } else {
        setRewardsValueInUSD('Calculating...');
      }
    }, [xrpPriceUSD, rewardsToClaim]);


    // fetch token balance
    const [tokenBalance, setTokenBalance] = useState('Loading...');

    useEffect(() => {
      const fetchTokenBalance = async () => {
        if (address) {
          try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

            const balance = await tokenContract.balanceOf(address);
            // Format balance and set it to 2 decimal places
            const formattedBalance = ethers.utils.formatUnits(balance, 'ether');
            setTokenBalance(parseFloat(formattedBalance).toFixed(2)); // Now the balance is a string with 2 decimal places
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
               const provider = new ethers.providers.Web3Provider(window.ethereum);
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
                 const provider = new ethers.providers.Web3Provider(window.ethereum);
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


      // available balance after staking locks
      const [availableBalance, setAvailableBalance] = useState('Loading...');

      useEffect(() => {
        const fetchBalances = async () => {
          if (address) {
            try {
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

              const [balance, tokensStaked] = await Promise.all([
                tokenContract.balanceOf(address),
                tokenContract.tokensStaked1Month(address),
              ]);

              const available = balance.sub(tokensStaked);
              // Format balance and set it to 2 decimal places
              const formattedAvailable = ethers.utils.formatUnits(available, 'ether');
              setAvailableBalance(parseFloat(formattedAvailable).toFixed(2)); // Now the balance is a string with 2 decimal places
            } catch (error) {
              console.error('Error fetching balances:', error);
              setAvailableBalance('Error');
            }
          }
        };

        fetchBalances();
      }, [address]); // Fetch when the address changes



        const [unlockTime, setUnlockTime] = useState('Loading...');

        useEffect(() => {
          const fetchUnlockTime = async () => {
            if (address) {
              try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
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
                const provider = new ethers.providers.Web3Provider(window.ethereum);
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
               const provider = new ethers.providers.Web3Provider(window.ethereum);
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
                const provider = new ethers.providers.Web3Provider(window.ethereum);
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
               const provider = new ethers.providers.Web3Provider(window.ethereum);
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
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
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
                 const provider = new ethers.providers.Web3Provider(window.ethereum);
                 const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                 const [balance, tokensStaked3Months] = await Promise.all([
                   tokenContract.balanceOf(address),
                   tokenContract.tokensStaked3Months(address),
                 ]);

                 const available = balance.sub(tokensStaked3Months);
                 // Format balance and set it to 2 decimal places
                 const formattedAvailable = ethers.utils.formatUnits(available, 'ether');
                 setAvailableBalance3Months(parseFloat(formattedAvailable).toFixed(2)); // Now the balance is a string with 2 decimal places
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
                   const provider = new ethers.providers.Web3Provider(window.ethereum);
                   const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                   const stakedTimestamp3Months = await tokenContract._staked1MonthTimestamp(address);
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
                   const provider = new ethers.providers.Web3Provider(window.ethereum);
                   const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                   const timestamp = await tokenContract._staked1MonthTimestamp(address);
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
                  const provider = new ethers.providers.Web3Provider(window.ethereum);
                  const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                  const stakedTimestamp3MonthsBN = await tokenContract._staked1MonthTimestamp(address);
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
                   const provider = new ethers.providers.Web3Provider(window.ethereum);
                   const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                   const stakedTimestamp3MonthsBN = await tokenContract._staked1MonthTimestamp(address);
                   const stakedTimestamp3Months = stakedTimestamp3MonthsBN.toNumber();

                   // Add 30 days to the staked timestamp
                   const unlockTime3Monthsstamp = new Date(stakedTimestamp3Months * 1000);
                   unlockTime3Monthsstamp.setDate(unlockTime3Monthsstamp.getDate() + 30);

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
                   const provider = new ethers.providers.Web3Provider(window.ethereum);
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
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
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
                     const provider = new ethers.providers.Web3Provider(window.ethereum);
                     const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                     const [balance, tokensStaked6Months] = await Promise.all([
                       tokenContract.balanceOf(address),
                       tokenContract.tokensStaked6Months(address),
                     ]);

                     const available = balance.sub(tokensStaked6Months);
                     // Format balance and set it to 2 decimal places
                     const formattedAvailable = ethers.utils.formatUnits(available, 'ether');
                     setAvailableBalance6Months(parseFloat(formattedAvailable).toFixed(2)); // Now the balance is a string with 2 decimal places
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
                       const provider = new ethers.providers.Web3Provider(window.ethereum);
                       const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                       const stakedTimestamp6Months = await tokenContract._staked1MonthTimestamp(address);
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
                       const provider = new ethers.providers.Web3Provider(window.ethereum);
                       const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                       const timestamp = await tokenContract._staked1MonthTimestamp(address);
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
                      const provider = new ethers.providers.Web3Provider(window.ethereum);
                      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                      const stakedTimestamp6MonthsBN = await tokenContract._staked1MonthTimestamp(address);
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
                       const provider = new ethers.providers.Web3Provider(window.ethereum);
                       const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

                       const stakedTimestamp6MonthsBN = await tokenContract._staked1MonthTimestamp(address);
                       const stakedTimestamp6Months = stakedTimestamp6MonthsBN.toNumber();

                       // Add 30 days to the staked timestamp
                       const unlockTime6Monthsstamp = new Date(stakedTimestamp6Months * 1000);
                       unlockTime6Monthsstamp.setDate(unlockTime6Monthsstamp.getDate() + 30);

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






  return (
      <>
      <ToastContainer />
        <Box p={4} color="white" bg="blue.500">
          <Flex justifyContent="space-between" alignItems="center">
            <Text style={headerTextStyle}>Staking for Locks</Text>
            <ConnectButton />
          </Flex>
        </Box>

        <Container maxW="container.xl" p={4}>
          <Flex direction="column" gap={4}>
          <Box h="400px" bg="gray.200" p={4}>
            {/* Use the paddingTop for the first div after the heading */}
            <div>Token General Info</div>
            <div style={{ paddingTop: '20px' }}>
              Description of Dapp here Talk about the features of this page at least 100-200 words
              Token Information Find all relevant information about TokenDapp, including its purpose, benefits, and
              how it integrates with our DApp, in the token information section.
            </div>
            <div style={{ paddingTop: '20px' }}>Liquidity of Token: $123,456.00 USD</div>
            <div>Total Supply: 5 Billion</div>
            <div>Burnt to date: 1,000,000,000</div>
            <div>Remaining Supply: 4,000,000,000</div>
          </Box>

            {/* Adjusted Flex container for equal height columns */}
            <Flex direction={{ base: "column", md: "row" }} gap={4}>

            <Box flex={1} bg="gray.300" p={4} display="flex" flexDirection="column">
              Connected Users Token Statistics and rewards Values to date



                <div style={{ paddingTop: '20px' }}> Your Total Token Balance: {tokenBalance} </div>
                <div>  your Staked Balance all pools: {tokensStaked1Month}</div>
                <div>Available Balance: {availableBalance} Tokens</div>


              <div style={{ paddingTop: '20px' }}>
              Connected user rewards to date: token A: 34 TOKENA ($0.78 USD)</div>
              <div>Connected user rewards to date: token B: 18000 TOKENB ($0.53 USD)</div>


              <div style={{ paddingTop: '20px' }}>
              Reward recieved valued to date at $1.31 USD</div>




            </Box>


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
                      <Box
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                        marginTop='4'
                        style={{ backgroundColor: '' }} // Light dark grey color
                        >

                        <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                          30 Day Staking Pool
                        </div>

                        <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                        Receive 2x Reflections on staked tokens in this pool
                        </div>

{/* Staking Section */}
<Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4'>
<Input
placeholder='Enter amount to stake 30 Days'
value={stakeAmount}
onChange={(e) => setStakeAmount(e.target.value)}
size='md'
width='250px'
/>
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
<Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4'>
<Button
onClick={onUnstake1MonthClick}
textColor='white'
bg='Blue'
_hover={{ bg: 'Blue' }}
>
Unstake
</Button>
</Box>
<div>30 Day active Stake: {userStaked}</div>
<div>Your Tokens Staked for 1 Month: {tokensStaked1Month}</div>
<div>Staked on: {stakedTimestamp}</div>
<div>Unlock Date: {unlockDate}</div>

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

                          <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                            90 Day Staking Pool
                          </div>

                          <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                          Receive 4x Reflections on staked tokens in this pool
                          </div>

                    {/* Staking Section */}
                    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4'>
                    <Input
                    placeholder='Enter amount to stake 30 Days'
                    value={stakeAmount3Months}
                    onChange={(e) => setStakeAmount3Months(e.target.value)}
                    size='md'
                    width='250px'
                    />
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
                    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4'>
                    <Button
                    onClick={onUnstake3MonthsClick}
                    textColor='white'
                    bg='Blue'
                    _hover={{ bg: 'Blue' }}
                    >
                    Unstake
                    </Button>
                    </Box>
                    <div>90 Day active Stake: {userStaked3Months}</div>
                    <div>Your Tokens Staked for 3 Month: {tokensStaked3Months}</div>
                    <div>Staked on: {stakedTimestamp3Months}</div>
                    <div>Unlock Date: {unlockDate3Months}</div>

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

                            <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                              180 Day Staking Pool
                            </div>

                            <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                            Receive 8x Reflections on staked tokens in this pool
                            </div>


                      {/* Staking Section */}
                      <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4'>
                      <Input
                      placeholder='Enter amount to stake 180 Days'
                      value={stakeAmount6Months}
                      onChange={(e) => setStakeAmount6Months(e.target.value)}
                      size='md'
                      width='250px'
                      />
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
                      <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop='4'>
                      <Button
                      onClick={onUnstake6MonthsClick}
                      textColor='white'
                      bg='Blue'
                      _hover={{ bg: 'Blue' }}
                      >
                      Unstake
                      </Button>
                      </Box>
                      <div>180 Day active Stake: {userStaked6Months}</div>
                      <div>Your Tokens Staked for 6 Month: {tokensStaked6Months}</div>
                      <div>Staked on: {stakedTimestamp6Months}</div>
                      <div>Unlock Date: {unlockDate6Months}</div>

                      </Box>
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
            </Flex>

            <Box minH="200px" bg="gray.200" p={4}>

  Multiple Staking Lock Periods: Choose from 30-day, 90-day, and 180-day lock periods to stake your tokens.
  Token Statistics: View detailed statistics of your tokens, including available, staked, and total balances.
  Total Statistics: Access aggregated statistics to understand the overall staking landscape.
  Liquidity Pools Tracker: Monitor the value of the token's LP and other pools directly from the DApp.
  Swapper DApp: Easily buy the DApp's token with the native currency or sell it back to the native currency without affecting the network's value stability.
  NFT Minting: Projects with NFT collections can utilize our DApp for their minting process.
  Comprehensive Token Information: Find all the information about the token, including its utility, benefits, and roadmap.
  Live Price Data: Stay updated with live price data for both the DApp's token and the native currency.

            </Box>


            <Box h="100px" bg="gray.300" p={4}>
              Content for Forth Row
            </Box>


                        {/* Adjusted Flex container for equal height columns */}
                        <Flex direction={{ base: "column", md: "row" }} gap={4}>

                        <Box  flex={1} bg="gray.300" p={4} display="flex" flexDirection="column">
                          Mint NFT section collection 1

                          {/* Mint NFT Section */}
            <Box flex={1} bg="gray.300" p={4} display="flex" flexDirection="column">
              <VStack spacing={4}>
                <Text fontSize="xl" fontWeight="bold">NFT Name: NameNFT</Text>
                <Text>SYMBOL: NFTSYMBOL</Text>
                <Text>Cost to Mint: 10USD</Text>
                <Text>NFT Supply: 23/70</Text>
                <Button colorScheme="blue" size="md">
                  Mint Now
                </Button>
              </VStack>
            </Box>

                        </Box>


                          <Box flex={1} bg="gray.300" p={4} display="flex" flexDirection="column">
                            Mint NFT section collection 2

                            {/* Mint NFT Section */}
            <Box flex={1} bg="gray.300" p={4} display="flex" flexDirection="column">
              <VStack spacing={4}>
                <Text fontSize="xl" fontWeight="bold">NFT Name: NameNFT</Text>
                <Text>SYMBOL: NFTSYMBOL</Text>
                <Text>Cost to Mint: 10USD</Text>
                <Text>NFT Supply: 23/70</Text>
                <Button colorScheme="blue" size="md">
                  Mint Now
                </Button>
              </VStack>
            </Box>
                          </Box>

                        </Flex>

          </Flex>
        </Container>

        <Box p={4} color="white" bg="black" textAlign="center">
          © 2024 In Haus Development
        </Box>
      </>
    );
  };

  export default App;
