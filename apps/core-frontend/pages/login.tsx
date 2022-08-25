import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Send } from '@mui/icons-material';
import { useMutation, gql } from '@apollo/client';
import { styled } from '@mui/material/styles';
import { useLoggedInRedirect } from '@micros/ui';
import { useRouter } from 'next/router';

const USER_LOGIN = gql`
    mutation sendUserLoginLink($email: EmailAddress!) {
        sendUserLoginLink(email: $email)
    }
`;

const StyledContainer = styled(Container)`
    padding: 40;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const StyledTitle = styled(Typography)`
    margin-top: 20px;
    margin-bottom: 20px;
`;

const StyledForm = styled('form')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const StyledTextField = styled(TextField)`
    margin-top: 40px;
    margin-bottom: 40px;
`;

export default function Login() {
    useLoggedInRedirect();
    const router = useRouter();
    const [redirect, setRedirect] = useState('/dashboard');
    useEffect(() => {
        if (router.query.redirect) {
            setRedirect(router.query.redirect as string);
        }
    }, [router]);

    const [success, setSuccess] = React.useState(false);
    const [userLogin, { data, loading, error }] = useMutation(USER_LOGIN);

    const handleLoginSubmit = (
        ev: React.FormEvent<
            HTMLFormElement & {
                readonly elements: HTMLFormControlsCollection & {
                    email: HTMLInputElement;
                };
            }
        >
    ) => {
        ev.preventDefault();
        const { email } = ev.currentTarget.elements;

        userLogin({
            variables: {
                email: email.value,
                redirect,
            },
        }).then(() => {
            setSuccess(true);
        });
    };

    return (
        <StyledContainer maxWidth="md">
            <StyledTitle variant="h4" align="center">
                Login
            </StyledTitle>
            {!success && (
                <>
                    <Typography variant="body1" align="center">
                        Enter the email address associated with your account
                    </Typography>
                    <StyledForm onSubmit={handleLoginSubmit}>
                        <StyledTextField
                            id="outlined-basic"
                            label="Email"
                            type="email"
                            variant="outlined"
                            name="email"
                        />
                        {error && <div>{error.message}</div>}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disableElevation
                            size="large"
                            endIcon={<Send />}
                            disabled={loading}
                        >
                            Send Login Link
                        </Button>
                    </StyledForm>
                </>
            )}
            {success && (
                <>
                    <Typography variant="body1" align="center">
                        Great! We&apos;ve sent you a login link! Check your
                        email.
                        <br />
                        <br />
                        Didn&apos;t recieve it?
                    </Typography>
                    <br></br>
                    <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        size="large"
                        onClick={() => setSuccess(false)}
                    >
                        Try again
                    </Button>
                </>
            )}
        </StyledContainer>
    );
}
