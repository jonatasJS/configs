// music player page
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import axios from "axios";
import { useEffect, useState } from "react";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import Image from "next/image";

import styles from "../../styles/Episode.module.scss";
import Link from "next/link";
import Head from "next/head";

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

export default function Episode({ channels }: MusicaDataTypes) {
  const [music, setMusic] = useState<MusicProps[]>([] as MusicProps[]);

  useEffect(() => {
    setMusic(channels);
  }, [channels]);

  console.log("channels", channels);
  console.log("music", music);

  return (
    <div className={styles.episode}>
      <Head>
        <title>{music[0].title}</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={240}
          height={240}
          src={music[0]?.cover || ""}
          objectFit="cover"
        />
        <button type="button">
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <audio
        src={music[0]?.stream_url || ""}
        autoPlay
        controls
        style={{ width: "100%" }}
      />a

      <header
        style={{
          color: music[0]?.color || "",
        }}
      >
        <h1>{music[0]?.title}</h1>
        <span>{music[0]?.artist}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: music[0]?.stream_url }}
      />
    </div>
  );
}

// gerar as páginas estáticas com os dados da api "https://api.ilovemusic.team/traffic" em tempo de build
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await axios.get(
    "https://api.ilovemusic.team/traffic"
  );

  const paths = data.channels.map((channel: { channel_id: { toString: () => any; }; }) => {
    return {
      params: {
        id: channel.channel_id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

// gerar os dados da api "https://api.ilovemusic.team/traffic" em tempo de build
export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx.params?.id;
  const { data } = await axios.get(
    "https://api.ilovemusic.team/traffic"
  );

  const channels = data.channels.filter((channel: { channel_id: number; }) => {
    return channel.channel_id === Number(id);
  });

  return {
    props: {
      channels,
    },
    revalidate: 60 * 60 * 8,
  };
}