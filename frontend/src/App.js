import { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import LoginRegister from "./components/LoginRegister";
import UserComments from "./components/UserComments";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import fetchModelData from "./lib/fetchModelData";
import postJSON from "./lib/postJSON";
import "./styles/layout.css";

function AppRoutes({ currentUser, advanced, onLogin, photoRefresh }) {
  const navigate = useNavigate();

  const handleLogin = (user) => {
    onLogin(user);
    navigate(`/users/${user._id}`);
  };

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginRegister onLogin={handleLogin} />} />
        <Route path="/register" element={<LoginRegister onLogin={handleLogin} />} />
        <Route path="*" element={<LoginRegister onLogin={handleLogin} />} />
      </Routes>
    );
  }

  const photosPage = <UserPhotos advanced={advanced} refresh={photoRefresh} />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/users/${currentUser._id}`} replace />} />
      <Route path="/users" element={<UserList currentUser={currentUser} />} />
      <Route path="/users/:userId" element={<UserDetail />} />
      <Route path="/photos/:userId" element={photosPage} />
      <Route path="/photos/:userId/:photoId" element={photosPage} />
      <Route path="/comments/:userId" element={<UserComments />} />
      <Route path="*" element={<Navigate to={`/users/${currentUser._id}`} replace />} />
    </Routes>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [photoRefresh, setPhotoRefresh] = useState(0);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      try {
        const user = await fetchModelData("/admin/current");
        if (active) setCurrentUser(user);
      } catch {
        if (active) setCurrentUser(null);
      } finally {
        if (active) setAuthChecked(true);
      }
    };

    checkAuth();

    return () => {
      active = false;
    };
  }, []);

  const logout = async () => {
    try {
      await postJSON("/admin/logout", {});
    } catch {
      // Session có thể đã hết hạn từ trước
    }
    setCurrentUser(null);
  };

  if (!authChecked) {
    return <Typography className="app-loading">Loading...</Typography>;
  }

  return (
    <BrowserRouter>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar
            currentUser={currentUser}
            advanced={advanced}
            setAdvanced={setAdvanced}
            onLogout={logout}
            onPhotoUploaded={() => setPhotoRefresh((n) => n + 1)}
          />
        </Grid>
        <div className="main-topbar-buffer" />
        <Grid item sm={3}>
          <Paper className="main-grid-item">
            <UserList currentUser={currentUser} />
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="main-grid-item">
            <AppRoutes
              currentUser={currentUser}
              advanced={advanced}
              onLogin={setCurrentUser}
              photoRefresh={photoRefresh}
            />
          </Paper>
        </Grid>
      </Grid>
    </BrowserRouter>
  );
}