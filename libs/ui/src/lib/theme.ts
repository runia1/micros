import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: "#005eff",
        },
        secondary: {
            main: "#00c5ff",
        },
        error: {
            main: red.A400,
        },
        background: {
            default: "#fff",
        },
    },
});

export default theme;
