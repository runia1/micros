import Head from 'next/head';
import Container from '@mui/material/Container';

export default function Lost() {
    return (
        <Container>
            <Head>
                <title>404</title>
            </Head>
            <div>
                <main>
                    <h1>404 - This page doesn&apos;t exist.</h1>
                    <br />
                    Are you lost?{' '}
                    <a href="https://www.aopa.org/news-and-media/all-news/2016/january/flight-training-magazine/technique">
                        Remember the 4 C&apos;s
                    </a>
                </main>
            </div>
        </Container>
    );
}
