import NextErrorComponent, { ErrorProps as NextErrorProps } from 'next/error';
import type { NextPageContext } from 'next/types';

type ErrorProps = NextErrorProps & {
    hasGetInitialPropsRun: boolean;
};

type Props = ErrorProps & {
    hasGetInitialPropsRun: boolean;
    err: Error;
};

const MyError = ({ statusCode, hasGetInitialPropsRun, err }: Props) => {
    return <NextErrorComponent statusCode={statusCode} />;
};

MyError.getInitialProps = async (
    context: NextPageContext
): Promise<ErrorProps> => {
    const errorInitialProps: ErrorProps = {
        ...(await NextErrorComponent.getInitialProps(context)),
        // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
        // getInitialProps has run
        hasGetInitialPropsRun: true,
    };

    return errorInitialProps;
};

export default MyError;
