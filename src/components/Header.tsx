/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { injected } from "../connecthook/connect";
import { switchNetwork } from "../connecthook/switch-network";
import { FaWallet } from "react-icons/fa";

export default function Header() {
  const router = useRouter();
  // const [open, setOpen] = useState(false);

  const { account, chainId, activate, deactivate } = useWeb3React();

  async function connect() {
    if (chainId !== 114 || chainId === undefined) {
      switchNetwork();
    }
    try {
      console.log("clicked");
      await activate(injected);
      localStorage.setItem("isWalletConnected", "true");
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", "false");
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injected);
          localStorage.setItem("isWalletConnected", "true");
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="w-full h-[80px] flex justify-center px-[100px] fixed z-[9999] py-3 items-center">
      <Head>
        <link rel="icon" href="/logoIMG.png" />
      </Head>
      <div className="flex items-center h-full px-10 py-5 text-white border-[1px] border-gray-400 rounded-lg text-whitebg-white backdrop-blur-sm bg-opacity-10 bg-white">
        <p className="text-3xl font-bold text-white">AnimalLove Breeding</p>
      </div>
      {/* <Link href={`/`} passHref>
        <div className="hidden cursor-pointer logo lg:block">
          <img
            src="/logoIMG.png"
            className="object-cover object-center w-[80px] h-[80px] p-2"
            alt=""
          />
        </div>
      </Link> */}

      <div className="absolute flex items-center right-10">
        {/* <Link href={"https://doodlebunnyflr.live/mint"} passHref>
          <li
            className={`text-[1.5rem] hover:text-white duration-300 transition-all cursor-pointer gradient_link ${
              router.pathname === "/" ? "text-red-500 underline" : ""
            }`}
          >
            Mint
          </li>
        </Link> */}
        {account ? (
          <button
            onClick={() => disconnect()}
            className="px-2 py-3 text-white border-[1px] border-gray-400 rounded-lg backdrop-blur-sm font-normal bg-white bg-opacity-10"
          >
            <span className="flex gap-2 font-normal text">
              <FaWallet style={{ marginTop: "3%" }} />
              {account && account.slice(0, 4) + "..." + account.slice(-4)}
            </span>
          </button>
        ) : (
          <button
            onClick={() => connect()}
            className="px-2 py-3 text-white bg-opacity-10 border-[1px] border-gray-400 rounded-lg backdrop-blur-sm font-normal bg-white"
          >
            <span className="flex gap-2 font-normal text">Connect Wallet</span>
          </button>
        )}
      </div>
    </header>
  );
}
