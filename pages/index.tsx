import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Homepage from './Homepage'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Homepage/>
    </div>
  )
}

export default Home
