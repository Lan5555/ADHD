import { Snackbar, IconButton, Alert } from "@mui/material";
import { CSSProperties } from "react";
import { useWatch } from "../hooks/page_index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

interface Props {
  text?: string;
  duration?: number;
  style?: CSSProperties;
  anchor: {
    vertical?: 'top' | 'bottom';
    horizontal?: 'left' | 'center' | 'right';
  };
}

const ShowMaterialSnackbar: React.FC<Props> = ({ text, duration, style, anchor }) => {
  const { open, setOpen, snackSeverity,snackText } = useWatch();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration || 3000}
      onClose={handleClose}
      message={text ?? "This is a snackbar"}
      anchorOrigin={{
        vertical: anchor.vertical || 'bottom',
        horizontal: anchor.horizontal || 'center',
      }}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
          <FontAwesomeIcon icon={faClose}/>
        </IconButton>
      }
      >
        <Alert
        onClose={handleClose}
        severity={snackSeverity}
        sx={{ width: '100%' }}
        variant="filled"
      >
        {snackText}
      </Alert>
      </Snackbar>
  );
};

export default ShowMaterialSnackbar;
