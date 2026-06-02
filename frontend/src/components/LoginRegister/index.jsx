import { useState } from "react";
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import postJSON from "../../lib/postJSON";
import "./styles.css";

function AuthPanel({ title, fields, buttonLabel, onSubmit }) {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    await onSubmit(form, setError, setSuccess, () => setForm({}));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{title}</Typography>
      
      {fields.map(([label, key, type = "text", multiline]) => (
        <TextField
          key={key}
          label={label}
          type={type}
          multiline={multiline}
          minRows={multiline ? 2 : undefined}
          value={form[key] || ""}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          size="small"
          fullWidth
        />
      ))}

      <Button variant="contained" onClick={handleSubmit} fullWidth>
        {buttonLabel}
      </Button>

      {error && <Typography color="error" variant="body2">{error}</Typography>}
      {success && <Typography color="success.main" variant="body2">{success}</Typography>}
    </Stack>
  );
}

export default function LoginRegister({ onLogin }) {
  const handleLogin = async (form, setError) => {
    try {
      const data = await postJSON("/admin/login", form);
      onLogin(data);
    } catch (e) {
      setError(e.message || "Login failed");
    }
  };

  const handleRegister = async (form, setError, setSuccess, resetForm) => {
    if (form.password !== form.password2) {
      return setError("Passwords do not match");
    }
    try {
      const { password2, ...payload } = form;
      await postJSON("/user", payload);
      setSuccess("Registration successful");
      resetForm();
    } catch (e) {
      setError(e.message || "Registration failed");
    }
  };

  return (
    <Paper className="login-paper">
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} divider={<Divider flexItem />}>
        <Box className="login-col">
          <AuthPanel title="Login" fields={LOGIN_FIELDS} buttonLabel="Login" onSubmit={handleLogin} />
        </Box>
        <Box className="login-col">
          <AuthPanel title="Register" fields={REG_FIELDS} buttonLabel="Register" onSubmit={handleRegister} />
        </Box>
      </Stack>
    </Paper>
  );
}

const LOGIN_FIELDS = [
  ["Login Name", "login_name"],
  ["Password", "password", "password"],
];

const REG_FIELDS = [
  ...LOGIN_FIELDS,
  ["Confirm Password", "password2", "password"],
  ["First Name", "first_name"],
  ["Last Name", "last_name"],
  ["Location", "location"],
  ["Description", "description", "text", true],
  ["Occupation", "occupation"],
];