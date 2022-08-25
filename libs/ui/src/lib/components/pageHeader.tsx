import { FC } from 'react';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import HelpIcon from '@mui/icons-material/Help';

const StyledToolbar = styled(Toolbar)`
    justify-content: space-between;
`;

type Props = {
    title: string;
    tooltip: string;
};

const PageHeader: FC<Props> = ({ title, tooltip, children }) => (
    <StyledToolbar>
        <Typography variant="h4">
            {title}
            <Tooltip title={<Typography variant="body1">{tooltip}</Typography>}>
                <IconButton aria-label={`${title} Description`} size="large">
                    <HelpIcon />
                </IconButton>
            </Tooltip>
        </Typography>
        <div>{children}</div>
    </StyledToolbar>
);

export default PageHeader;
