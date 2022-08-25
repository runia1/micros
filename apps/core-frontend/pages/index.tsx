import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { MarketingContainer, useLoggedInRedirect } from '@micros/ui';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const FirstSectionDiv = styled('div')`
    color: white;
    text-align: center;
`;

export default function Home() {
    useLoggedInRedirect();

    return (
        <MarketingContainer>
            <FirstSectionDiv>
                <br />
                <br />
                <br />
                <br />
                <Typography variant="h3" align="center">
                    Some Product Name
                </Typography>
                <br />
                <br />
                <Typography variant="h6" align="center">
                    This is a super sick product that you need to sign up for
                    and pay us money each month!
                </Typography>
                <Link href="/signup" passHref>
                    <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        size="large"
                    >
                        Try it free for 30 days
                    </Button>
                </Link>
                <br />
                <br />
                <br />
                <br />
            </FirstSectionDiv>
        </MarketingContainer>
    );
}
