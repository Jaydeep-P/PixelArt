import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
import styles from '../styles/Home.module.css'

const ghpath= '/PixelArt';

export default function Home() {
  return (
    <div>
      <Head>
        <title>PixelArt</title>
        <meta name="description" content="PixelArt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.leftDiv}>
          <h1 className={styles.text}>PixelArt</h1>
          <p className={styles.text}>Upload a picture by clicking the Upload button, this image will be converted into a 128x128 image.</p>
          <p className={styles.text}>The actual resolution of the generated image is 2048x2048</p>
          <p className={styles.text}>The image may be squished if it&apos;s aspect-ratio is not 1:1</p>
          
          <div className={styles.text}>Scroller for default images</div>
          
          <div className={styles.scroller}>
            <div id="left" className={styles.scrollLeft}>🢀</div>
            <div id="right" className={styles.scrollRight}>🢂</div>
          </div>
        </div>
        
        <div className={styles.canvasDiv}>
          <canvas className={styles.mainCanvas} id = "mainCanvas" width="2048" height="2048"></canvas>
        </div>

        <div className={styles.uploadDiv}>
          <label htmlFor="image" className={styles.uploadLabel}>
            <input type="file"
            id="image" className={styles.image}
            accept="image/*"></input>

            <div className={styles.uploadName}>
              Upload
            </div>
          </label>
          
        </div>
      </div>
      

      <Script src={ghpath+"/script.js"} strategy="lazyOnload"  />
    </div>
  )
}
