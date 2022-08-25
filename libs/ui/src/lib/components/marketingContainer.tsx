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
                    <Link href="/login" passHref>
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
