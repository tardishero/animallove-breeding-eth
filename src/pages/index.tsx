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
    <main className="container flex flex-col items-center justify-center w-full min-h-screen lg:px-[100px] md:px-[30px] px-5">
      {/* <img
        src="/img/homeBackground.png"
        className="fixed top-0 left-0 object-cover w-full h-full -z-10"
      /> */}
      <div className="relative z-50 min-h-[80vh] bg-white bg-opacity-10 backdrop-blur-sm mt-[100px] w-full rounded-lg my-10">
        <img
          src="/img/banner.png"
          className="object-cover object-center w-full rounded-t-lg md:h-[300px] h-[200px]"
        />
        <div className="flex items-center justify-center w-full -mt-10">
          <img
            src="/img/dogAvatar.png"
            className="w-[80px] h-[80px] object-cover rounded-full"
          />
        </div>
        <div className="grid w-full gap-5 px-10 mt-5 md:grid-cols-2">
          <div className="border-gray-400 p-5 border-[1px] rounded-md min-h-[45vh]">
            <p className="text-3xl font-bold text-center text-white">Male</p>
          </div>
          <div className="border-gray-400 p-5 border-[1px] rounded-md min-h-[45vh]">
            <p className="text-3xl font-bold text-center text-white">Female</p>
          </div>
        </div>
        <div className="flex items-center justify-center w-full my-7">
          <button className="px-4 py-2 font-bold text-black transition-all duration-300 bg-white rounded-md hover:bg-gray-300">
            Start Breeding
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
