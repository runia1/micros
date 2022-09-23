import Link from 'next/link';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

const StyledDiv = styled('div')`
    height: 100%;
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(70, 139, 212, 1) 10%,
        rgba(13, 98, 187, 1) 100%
    );
`;

const loginParams = {
    client_id: 'foo',
    redirect_uri: 'http://localhost:4200/authn/login-callback',
    scope: 'openid',
    response_type: 'id_token',
    nonce: 'xyzABC123',
    // state: '',
};

const oidcLoginLink = `http://localhost:3000/auth?${Object.entries(loginParams)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')}`;

export default function MarketingContainer({ children }: any) {
    return (
        <StyledDiv>
            <Container maxWidth="md">
                <Toolbar
                    sx={{
                        color: 'white',
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{ marginLeft: '5px', flexGrow: 1 }}
                    >
                        Some Product Name
                    </Typography>
                    <Link href={oidcLoginLink} passHref>
                        <Button
                            color="secondary"
                            disableElevation
                            sx={{ marginRight: '10px', color: 'white' }}
                        >
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup" passHref>
                        <Button
                            color="primary"
                            variant="contained"
                            disableElevation
                        >
                            Free Trial
                        </Button>
                    </Link>
                </Toolbar>
                {children}
            </Container>
        </StyledDiv>
    );
}
