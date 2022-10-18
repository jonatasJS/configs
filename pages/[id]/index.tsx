// music player page
import Link from "next/link";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import Image from "next/image";
import {
  HiPlay as PlayIcon,
  HiHeart as HeartIcon,
  HiPause as PauseIcon,
  HiArrowNarrowLeft as ArrowLeftIcon,
} from "react-icons/hi";

import styles from "../../styles/Episode.module.scss";

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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setMusic(channels);
  }, [channels]);

  return (
    <div className={styles.episode}>
      <Head>
        <link rel="shortcut icon" href={music[0]?.cover ? music[0]?.cover : ""} />
        <title>{music[0]?.title ? music[0].title : ""}</title>
      </Head>
      <div className={styles.episodeContainer}>
        <div className={styles.episodeHeader}>
          <Link href="/">
            <a>
              <ArrowLeftIcon size={32} color="#fff" />
            </a>
          </Link>

          <div className={styles.episodeHeaderImage}>
            <Image
              blurDataURL={music[0]?.cover ? music[0].cover : ""}
              width={350}
              height={350}
              src={music[0]?.cover ? music[0].cover : ""}
              alt={music[0]?.title ? music[0].title : ""}
            />
          </div>

          <div className={styles.episodeHeaderInfo}>
            <div className={styles.episodeHeaderInfoTitle}>
              <h2>{music[0]?.title ? music[0].title : ""}</h2>
            </div>
            <div className={styles.episodeHeaderInfoArtist}>
              <span>{music[0]?.artist ? music[0].artist : ""} - </span>
              <span>{music[0]?.name ? music[0].name : ""}</span>
            </div>
          </div>
        </div>
        <div className={styles.episodePlayer}>
          <button
            type="button"
            className={styles.episodePlayerButton}
            style={{
              backgroundColor: music[0]?.fontcolor ? music[0].fontcolor : "",
              color: music[0]?.color ? music[0].color : "",
            }}
            onClick={() => {
              if (audioRef.current) {
                if (audioRef.current.paused) {
                  audioRef.current.play();
                  setIsPlaying(true);
                } else {
                  audioRef.current.pause();
                  setIsPlaying(false);
                }
              }
            }}
          >
            {isPlaying ? (
              <PauseIcon
                size={32}
                style={{
                  color: music[0]?.color ? music[0].color : "",
                }}
              />
            ) : (
              <PlayIcon
                size={32}
                style={{
                  color: music[0]?.color ? music[0].color : "",
                }}
              />
            )}
          </button>
          <button
            type="button"
            className={styles.episodePlayerButton}
            style={{
              backgroundColor: music[0]?.fontcolor ? music[0].fontcolor : "",
              color: liked ? "#FF0000" : "#fff",
            }}
            onClick={() => {
              setLiked(!liked);
            }}
          >
            <HeartIcon
              size={32}
              style={{
                color: liked ? "#FF0000" : "#fff",
              }}
            />
          </button>
          {/* 
            range of the music
          */}
          <div className={styles.episodePlayerRange}>
            <span>
              {music[0]?.stream_url ? convertDurationToTimeString(0) : ""}
            </span>
            <div className={styles.episodePlayerRangeBar}>
              <div
                className={styles.episodePlayerRangeBarProgress}
                style={{
                  backgroundColor: music[0]?.color ? music[0].color : "",
                }}
              />
              <div
                className={styles.episodePlayerRangeBarThumb}
                style={{
                  transform: `translateX(${music[0]?.stream_url ? 0 : 10}%)`,
                }}
              />
            </div>
            <span>
              {music[0]?.stream_url ? convertDurationToTimeString(0) : ""}
            </span>
          </div>

          <audio
            src={music[0]?.stream_url ? music[0].stream_url : ""}
            controls
            autoPlay
            ref={audioRef}
          />
        </div>
      </div>
    </div>
  );
}

// gerar as páginas estáticas com os dados da api "https://api.ilovemusic.team/traffic" em tempo de build
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await axios.get("https://api.ilovemusic.team/traffic");

  const paths = data.channels.map(
    (channel: { channel_id: { toString: () => any } }) => {
      return {
        params: {
          id: channel.channel_id.toString(),
        },
      };
    }
  );

  return {
    paths,
    fallback: "blocking",
  };
};

// gerar os dados da api "https://api.ilovemusic.team/traffic" em tempo de build
export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx.params?.id;
  const { data } = await axios.get("https://api.ilovemusic.team/traffic");

  const channels = data.channels.filter((channel: { channel_id: number }) => {
    return channel.channel_id === Number(id);
  });

  return {
    props: {
      channels,
    },
    revalidate: 60 * 60 * 8,
  };
};
