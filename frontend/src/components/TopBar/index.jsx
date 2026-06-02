import { useEffect, useRef, useState } from "react";
import { AppBar, Box, Button, Checkbox, FormControlLabel, Stack, Toolbar, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import fetchModelData from "../../lib/fetchModelData";
import uploadPhoto from "../../lib/uploadPhoto";
import "./styles.css";

const TITLES = {
  users: (name, hasId) => (hasId ? name : "Danh sách người dùng"),
  photos: (name) => `Ảnh của ${name}`,
  comments: (name) => `Bình luận của ${name}`,
};

export default function TopBar({ currentUser, advanced, setAdvanced, onLogout, onPhotoUploaded }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!currentUser) {
      setTitle("");
      return undefined;
    }

    const [section, id] = pathname.split("/").filter(Boolean);
    if (!TITLES[section]) {
      setTitle("");
      return undefined;
    }
    if (section === "users" && !id) {
      setTitle(TITLES.users("", false));
      return undefined;
    }

    let active = true;
    fetchModelData(`/user/${id}`)
      .then((user) => {
        if (!active) return;
        const name = `${user.first_name} ${user.last_name}`;
        setTitle(TITLES[section](name, id));
      })
      .catch(() => active && setTitle(""));

    return () => {
      active = false;
    };
  }, [pathname, currentUser]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file || !currentUser) return;

    try {
      await uploadPhoto(file);
      alert("Đã thêm ảnh!");
      onPhotoUploaded?.();
      navigate(`/photos/${currentUser._id}`);
    } catch (err) {
      alert(err.message || "Tải ảnh thất bại");
    }
  };

  const handleLogout = async () => {
    await onLogout();
    navigate("/login");
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className="topbar-toolbar">
        <Typography variant="h6" color="inherit">
          App Thanh Le
        </Typography>
        <Box className="topbar-title-wrap">
          {title && <Typography color="inherit" noWrap>{title}</Typography>}
        </Box>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {currentUser ? (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    className="topbar-checkbox"
                    checked={advanced}
                    onChange={(e) => setAdvanced(e.target.checked)}
                    size="small"
                  />
                }
                label="Single image"
              />
              <Typography color="inherit">Hi {currentUser.first_name}</Typography>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleUpload} />
              <Button variant="outlined" color="inherit" size="small" onClick={() => fileRef.current.click()}>
                Add Photo
              </Button>
              <Button variant="contained" color="secondary" size="small" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Typography color="inherit">Please Login</Typography>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
