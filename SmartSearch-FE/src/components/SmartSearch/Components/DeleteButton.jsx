import { Delete02Icon } from "@hugeicons/core-free-icons";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";

const DeleteButton = ({
  onClick = () => {},
  size = "16px",
  disabled = false,
  name = "",
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setOpenDialog(true);
  };

  const handleConfirmDelete = async (e) => {
    setIsDeleting(true);
    try {
      // Handle both sync and async onClick functions
      const result = onClick(e);
      if (result && typeof result.then === "function") {
        await result;
      }
    } catch (error) {
      console.error("Delete operation failed:", error);
    } finally {
      setIsDeleting(false);
      setOpenDialog(false);
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    if (!isDeleting) {
      setOpenDialog(false);
    }
  };

  return (
    <>
      <IconButton
        color="error"
        size="small"
        onClick={handleDeleteClick}
        disabled={disabled}
      >
        <HugeiconsIcon icon={Delete02Icon} size={size} />
      </IconButton>

      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isDeleting ? "Deleting..." : "Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          {isDeleting ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CircularProgress size={20} />
              <Typography>
                {name ? `Deleting "${name}"...` : "Deleting item..."}
              </Typography>
            </Box>
          ) : (
            <>
              <Typography>
                {name
                  ? `Are you sure you want to delete "${name}"?`
                  : "Are you sure you want to delete this item?"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This action cannot be undone.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            color="primary"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : null}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteButton;
