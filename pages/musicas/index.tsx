import Head from "next/head";
import Link from "next/link";

import axios from "axios";

import styles from "../../styles/Musicas.module.scss";

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

export default function Musica({ channels }: { channels: MusicProps[] }) {
  // grid com todos os channels
  return (
    <div className={styles.container}>
      <Head>
        <title>Musicas</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Musicas</h1>

        <div className={styles.grid}>
          {channels?.map((channel) => (
            <Link href={`/${channel.channel_id}`} key={channel.channel_id}>
              <a className={styles.card}>
                <img src={channel.cover} alt={channel.title} />
                <h3>{channel.title}</h3>
                <p>{channel.artist}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const response = await axios.get(
    "https://api.ilovemusic.team/traffic"
  );

  const { channels } = response.data;

  console.log(channels);

  return {
    props: {
      channels,
    },
  };
}