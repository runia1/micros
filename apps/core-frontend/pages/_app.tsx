import Head from 'next/head';
import type { AppProps } from 'next/app';
import { theme, UserContextProvider } from '@micros/ui';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: '/api/graphql',
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Micros Demo Frontend</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <ApolloProvider client={client}>
                    <UserContextProvider>
                        <Component {...pageProps} />
                    </UserContextProvider>
                </ApolloProvider>
            </ThemeProvider>
        </>
    );
}
