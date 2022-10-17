import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";

import {
  RiSpeaker2Fill as SpeakerActive,
  RiSpeaker2Line as SpeakerInactive,
} from "react-icons/ri";

import styles from "../styles/Home.module.scss";
import { generateTemplate } from "../utils/generateTemplate";

interface MusicProps {
  channel_id: number;
  name: string;
  artist: string;
  title: string;
  cover: string;
  color: string;
  fontcolor: string;
  stream_url: string;
}

interface MusicaDataTypes {
  channels: MusicProps[];
}

function Home({ dataAudio }: { dataAudio: MusicaDataTypes }): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [isWiFi, setIsWiFi] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [volumeAudio, setVolumeAudio] = useState(0.3);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [musicsData, setMusicsData] = useState<MusicaDataTypes | null>(null);

  useEffect(() => {
    setAudio(null);
    setIsLoading(true);
    setIsPlayingMusic(false);

    async function loadAudio() {
      try {
        axios
          .get("https://streams.iloveradio.de/iloveradio1.mp3", {
            responseType: "blob",
          })
          .then((e) => {
            console.log(e.data);
            setAudioLoaded(true);
          })
          .catch((err) => {
            toast.info("Error while loading audio", {
              theme: "dark",
              position: "bottom-right",
            });
            setAudioLoaded(false);
          });
        const audio = new Audio(
          "https://streams.iloveradio.de/iloveradio1.mp3"
        );
        audio.volume = volumeAudio;
        setAudio(audio);
        setAudioLoaded(true);
      } catch (err) {
        setAudioLoaded(false);
        return err;
      }
    }

    loadAudio()
      .then(() => {
        setIsLoading(false);
        setAudioLoaded(true);
      })
      .catch((err) => {
        toast.error("Error loading audio");
        console.error(err);
        setIsLoading(false);
        setAudioLoaded(false);
      });
  }, [volumeAudio]);

  return (
    <>
      <Head>
        <title>Formulário de configuração</title>
        <meta name="description" content="Formulário de configuração" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Image
            src="http://pa1.narvii.com/6403/de2d49ca4dab24fd88c6e4e40431692c7ea8ac51_00.gif"
            alt="Loading"
            width={320}
            height={181}
          />
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 0.1, 1, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            Carregando...
          </motion.h1>
        </motion.div>
      ) : (
        <motion.div
          className={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "1rem",
          }}
        >
          {audioLoaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className={styles.musicContainer}
            >
              {/* mute button */}
              <button
                onClick={() => {
                  if (isPlayingMusic) {
                    audio?.pause();
                    setIsPlayingMusic(false);
                  } else {
                    audio?.play();
                    setIsPlayingMusic(!isPlayingMusic);
                  }
                  toast.info(
                    `Música ${
                      isPlayingMusic ? "desligada" : "ligada"
                    } com sucesso!`,
                    {
                      theme: "dark",
                      position: "bottom-right",
                      pauseOnFocusLoss: false,
                    }
                  );
                }}
              >
                {isPlayingMusic ? (
                  <SpeakerActive size={32} />
                ) : (
                  <SpeakerInactive size={32} />
                )}
              </button>
              {/* volume chenge */}
              <input
                className={styles.volume}
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={volumeAudio}
                onChange={(e) => {
                  setVolumeAudio(parseFloat(e.target.value));
                  audio?.volume
                    ? (audio.volume = parseFloat(e.target.value))
                    : null;
                }}
              />
              {/* show percentage */}
              <span
                className={styles.volumePercentage}
                style={{
                  transform: `translateY(-${volumeAudio * 100 * 2.5}%)`,
                }}
              >
                {Math.floor(volumeAudio * 100).toFixed(0)}%
              </span>

              {/* <select name="musics" id="musics"></select> */}
            </motion.div>
          )}
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const data = Object.fromEntries(formData.entries());

              // verificar se data é um objeto com chave com valores vazios
              if (
                Object.values(data).every(
                  (value) =>
                    value === "" ||
                    String(value) === ("on" || "") ||
                    value === undefined
                )
              ) {
                toast("Preencha todos os campos!", {
                  theme: "dark",
                  position: "bottom-right",
                  pauseOnFocusLoss: false,
                  type: "error",
                });
              } else {
                // copiar os dads para o clipboard
                generateTemplate({
                  data,
                  isWiFi,
                });

                toast("Copiado para a area de transferência!", {
                  theme: "dark",
                  position: "bottom-right",
                  pauseOnFocusLoss: false,
                  type: "success",
                });
              }
            }}
          >
            {/* 
            titulo do formulário
            */}
            <h2 className={styles.formTitle}>Formulário de configuração</h2>

            <div>
              <input
                type="text"
                name="equipment"
                id="equipment"
                placeholder="Equiamento"
              />
              <input type="text" name="mac" id="mac" placeholder="MAC" />
              <input
                type="text"
                name="signal"
                id="signal"
                placeholder="Sinal"
              />
              <input type="text" name="olt" id="olt" placeholder="OLT" />
              <input type="text" name="board" id="board" placeholder="Placa" />
              <input type="text" name="pon" id="pon" placeholder="PON" />
              <input type="text" name="vlan" id="vlan" placeholder="VLAN" />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                width: "100%",
                height: "100%",
                textAlign: "left",
              }}
            >
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  name="wifi"
                  id="wifi"
                  checked={isWiFi}
                  onChange={() => setIsWiFi(!isWiFi)}
                />
                <span className={styles.slider}></span>
              </label>
              <strong>Wi-Fi</strong>
            </div>

            {isWiFi && (
              <>
                <hr />

                <motion.h2
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  key={`${isWiFi}`}
                >
                  Rede Wi-Fi:
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  key={`${isWiFi + "animation"}`}
                >
                  <input type="text" name="name" id="name" placeholder="Nome" />
                  <input
                    type="text"
                    name="password"
                    id="password"
                    placeholder="Senha"
                  />
                </motion.div>
              </>
            )}

            <hr />

            <button type="submit">Copiar</button>
          </form>
        </motion.div>
      )}
    </>
  );
}

export default Home;

// generate a static version of the page
export async function getStaticProps() {
  async function loadAudios() {
    return await axios
      .create({
        baseURL: "https://api.ilovemusic.team",
      })
      .get("traffic", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        const { data } = response;
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  const dataAudio = await loadAudios();

  return {
    props: {
      dataAudio,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
}
