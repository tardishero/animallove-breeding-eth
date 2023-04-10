/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import {
  DOODLEBUNNYCONTRACTADDR,
  DOODLEIMGIPFSADDRESS,
  DOODLEIPFSADDRESS,
  BREEDINGCONTRACTADDR,
  TOKENCONTRACTADDR,
  BurnAmount,
} from "../config";

import Card from "../components/Card";
import ParentCard from "../components/ParentCard";
import {
  errorAlert,
  infoAlert,
  successAlert,
  warningAlert,
} from "../components/toastGroup";
import { RotateLoader } from "react-spinners";

interface NFTType {
  tokenId: number;
  imgUrl: string;
}

interface PARENTNFTType {
  maleTokenId: number;
  feMaleTokenId: number;
  maleImgUrl: string;
  feMaleImgUrl: string;
  startedTime: number;
  breedAllow: boolean;
  owner: string;
}

interface WindowWithEthereum extends Window {
  ethereum?: any;
}

const Home: NextPage = () => {
  const { account } = useWeb3React();
  const [maleList, setMaleList] = useState<NFTType[]>([]);
  const [femaleList, setFemmaleList] = useState<NFTType[]>([]);
  const [parentList, setParentList] = useState<PARENTNFTType[]>([]);

  const [selectedMale, setSelectedMale] = useState<NFTType[] | undefined>();
  const [selectedFemale, setSelectedFemale] = useState<NFTType[] | undefined>();

  const [nftApproveAllState, setNftApproveAllState] = useState<boolean>(false);
  const [startLoadingState, setStartLoadingState] = useState<boolean>(false);

  // const provider =
  //   typeof window !== "undefined" && (window as WindowWithEthereum).ethereum
  //     ? new ethers.providers.Web3Provider(
  //         (window as WindowWithEthereum).ethereum
  //       )
  //     : null;
  // const Signer = provider?.getSigner();

  // const DOODLECONTRACT = new ethers.Contract(
  //   DOODLEBUNNYCONTRACTADDR,
  //   DOODLEBUNYABI,
  //   Signer
  // );

  // const BREEDCONTRACT = new ethers.Contract(
  //   BREEDINGCONTRACTADDR,
  //   BREEDINGABI,
  //   Signer
  // );

  // const BUNNYTOKENCONTRACT = new ethers.Contract(
  //   TOKENCONTRACTADDR,
  //   BUNNYTOKENABI,
  //   Signer
  // );

  // const getApproveState = async () => {
  //   console.log(
  //     await DOODLECONTRACT.isApprovedForAll(account, BREEDINGCONTRACTADDR)
  //   );
  // };

  // useEffect(() => {
  //   console.log("doodlebunny ==>", DOODLECONTRACT);
  //   if (account) getApproveState();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [account]);

  // const getNFTList = async () => {
  //   let maleArray: NFTType[] = [];
  //   let femaleArray: NFTType[] = [];

  //   await DOODLECONTRACT.walletOfOwner(account).then(
  //     async (data: NFTType[]) => {
  //       for (let i = 0; i < data.length; i++) {
  //         try {
  //           const response = await fetch(
  //             DOODLEIPFSADDRESS + "/" + data[i] + `.json`,
  //             {
  //               method: "GET",
  //             }
  //           );
  //           const responsedata = await response.json();

  //           responsedata.attributes[6].trait_type === "Gender_m"
  //             ? maleArray.push({
  //                 tokenId: Number(data[i]),
  //                 imgUrl: DOODLEIMGIPFSADDRESS + Number(data[i]) + ".png",
  //               })
  //             : femaleArray.push({
  //                 tokenId: Number(data[i]),
  //                 imgUrl: DOODLEIMGIPFSADDRESS + Number(data[i]) + ".png",
  //               });
  //         } catch (error) {
  //           console.error("Unable to fetch data:", error);
  //         }
  //       }
  //     }
  //   );
  //   setMaleList(maleArray);
  //   setFemmaleList(femaleArray);
  // };

  // const getParentList = async () => {
  //   let parentArray: PARENTNFTType[] = [];
  //   await BREEDCONTRACT.getbreedingInfos().then(async (data: any) => {
  //     for (let i = 0; i < data.length; i++) {
  //       parentArray.push({
  //         owner: data[i].owner,
  //         maleTokenId: Number(data[i].doodleMaleID),
  //         feMaleTokenId: Number(data[i].doodleFemaleID),
  //         maleImgUrl:
  //           DOODLEIMGIPFSADDRESS + Number(data[i].doodleMaleID) + ".png",
  //         feMaleImgUrl:
  //           DOODLEIMGIPFSADDRESS + Number(data[i].doodleFemaleID) + ".png",
  //         startedTime: Number(data[i].stakedTime),
  //         breedAllow: data[i].breedAllow,
  //       });
  //     }
  //   });
  //   console.log("parentArray ===", parentArray);
  //   setParentList(parentArray);
  // };

  // const isApprovedState = async () => {
  //   const state = await DOODLECONTRACT.isApprovedForAll(
  //     account,
  //     BREEDINGCONTRACTADDR
  //   );
  //   setNftApproveAllState(state);
  // };

  // useEffect(() => {
  //   if (account) {
  //     getNFTList();
  //     getParentList();
  //     isApprovedState();
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [account]);

  // const handleWithdrawFunc = async (
  //   maleTokenId: number,
  //   femaleTokenId: number,
  //   owner: string
  // ) => {
  //   if (owner !== account) {
  //     warningAlert("These nfts are not yours!");
  //   } else {
  //     setStartLoadingState(true);
  //     await BREEDCONTRACT.withdraw(maleTokenId, femaleTokenId, {
  //       gasLimit: 300000,
  //     })
  //       .then((tx: { wait: () => Promise<any> }) => {
  //         tx.wait()
  //           .then(() => {
  //             successAlert("Withdraw Successful!");
  //             getNFTList();
  //             getParentList();
  //             setSelectedMale([]);
  //             setSelectedFemale([]);
  //             setStartLoadingState(false);
  //           })
  //           .catch(() => {
  //             setStartLoadingState(false);
  //             errorAlert("Withdraw canceled");
  //           });
  //       })
  //       .catch(() => {
  //         setStartLoadingState(false);
  //         infoAlert("Withdraw canceled");
  //       });
  //   }
  // };

  // const handleBreedingFunc = async () => {
  //   console.log(selectedMale?.[0]?.tokenId, selectedFemale?.[0]?.tokenId);
  //   if (
  //     selectedFemale?.[0]?.tokenId === undefined ||
  //     selectedFemale?.[0]?.tokenId === undefined
  //   ) {
  //     warningAlert("Please select the parent!");
  //   } else if (
  //     parentList.some(
  //       (item) =>
  //         item.maleTokenId === selectedMale?.[0]?.tokenId ||
  //         item.feMaleTokenId === selectedFemale?.[0]?.tokenId
  //     )
  //   ) {
  //     errorAlert("These parents have already used!");
  //   } else {
  //     setStartLoadingState(true);
  //     if (!nftApproveAllState) {
  //       await DOODLECONTRACT.setApprovalForAll(BREEDINGCONTRACTADDR, true, {
  //         gasLimit: 500000,
  //       })
  //         .then((tx: { wait: () => Promise<any> }) => {
  //           tx.wait().then(() => {
  //             BUNNYTOKENCONTRACT.approve(BREEDINGCONTRACTADDR, BurnAmount, {
  //               gasLimit: 300000,
  //             }).then((tx2: { wait: () => Promise<any> }) => {
  //               tx2.wait().then(() => {
  //                 BREEDCONTRACT.breed(
  //                   selectedFemale?.[0]?.tokenId,
  //                   selectedFemale?.[0]?.tokenId,
  //                   {
  //                     gasLimit: 500000,
  //                   }
  //                 )
  //                   .then((tx: { wait: () => Promise<any> }) => {
  //                     tx.wait()
  //                       .then(() => {
  //                         successAlert("Breeding Successful!");
  //                         getNFTList();
  //                         getParentList();
  //                         setStartLoadingState(false);
  //                         setSelectedFemale([]);
  //                         setSelectedMale([]);
  //                       })
  //                       .catch(() => {
  //                         setStartLoadingState(false);
  //                         errorAlert("Canceled the breeding");
  //                       });
  //                   })
  //                   .catch(() => {
  //                     setStartLoadingState(false);
  //                     infoAlert("Canceled the breeding");
  //                   });
  //               });
  //             });
  //           });
  //         })
  //         .catch(() => {});
  //     } else {
  //       setStartLoadingState(true);
  //       await BUNNYTOKENCONTRACT.approve(BREEDINGCONTRACTADDR, BurnAmount, {
  //         gasLimit: 300000,
  //       })
  //         .then((tx2: any) => {
  //           return tx2.wait();
  //         })
  //         .then(() => {
  //           BREEDCONTRACT.breed(
  //             Number(selectedMale?.[0]?.tokenId),
  //             Number(selectedFemale?.[0]?.tokenId),
  //             { gasLimit: 500000 }
  //           )
  //             .then((tx: any) => {
  //               return tx.wait();
  //             })
  //             .then(() => {
  //               successAlert("Breeding Successful!");
  //               getNFTList();
  //               getParentList();
  //               setStartLoadingState(false);
  //             })
  //             .catch((err: { message: any }) => {
  //               errorAlert("Cancelled the breeding");
  //               setStartLoadingState(false);
  //             });
  //         })
  //         .catch((err: { message: any }) => {
  //           infoAlert("Cancelled the breeding");
  //           setStartLoadingState(false);
  //         });
  //     }
  //   }
  // };

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen">
      <img
        src="/img/homeBackground.png"
        className="fixed object-cover w-full h-full"
      />
      <div className="z-50 text-3xl font-bold text-white">sdfsdfsd</div>
      <p className="z-50 text-3xl font-normal text-white">
        sdfsdfsd fssdfsdfs dfsdfs dfsdfwerwfgxb sdhbfdzgdfsd
      </p>
    </main>
  );
};

export default Home;
