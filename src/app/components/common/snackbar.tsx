import { Snackbar as MUISnackBar } from "@mui/base/Snackbar";
import { Alert, AlertColor, SnackbarCloseReason } from "@mui/material";
import React from "react";

export default function Snackbar({
  open: initOpen,
  text,
  severity,
  onClose
}: {
  open: boolean;
  text: string;
  severity: AlertColor;
  onClose: () => unknown;
}) {
  const [open, setOpen] = React.useState(initOpen);

  function handleClose(_: unknown, reason: SnackbarCloseReason) {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    onClose();
  }

  return (
    <MUISnackBar
      autoHideDuration={5000}
      open={open}
      onClose={handleClose}
      className="fixed z-50 font-sans flex right-4 bottom-4 left-auto max-w-xl min-w-xs"
    >
      <Alert onClose={(e) => handleClose(e, "escapeKeyDown")} severity={severity} sx={{ width: "100%" }}>
        {text}
      </Alert>
    </MUISnackBar>
  );
}
