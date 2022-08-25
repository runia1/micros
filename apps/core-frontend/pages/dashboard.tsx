import Head from 'next/head';
import { AppContainer } from '@micros/ui';

export default function Dashboard() {
    return (
        <AppContainer>
            <Head>
                <title>Dashboard</title>
            </Head>
            <div>
                <main>
                    <h1>Hello World!</h1>
                </main>
            </div>
        </AppContainer>
    );
}
