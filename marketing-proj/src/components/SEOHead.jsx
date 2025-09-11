import Head from "next/head";

export default function SEOHead({ title, description, image }) {
  return (
    <Head>
      <title>{title} | MSHAHRUKH</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
    </Head>
  );
}
