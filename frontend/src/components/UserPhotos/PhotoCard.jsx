import { Button, Card, CardContent, Divider, Link as MuiLink, Stack, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import formatDateTime from "../../lib/formatDate";
import "./styles.css";

export default function PhotoCard({ photo, text, error, onTextChange, onAddComment }) {
  return (
    <Card variant="outlined">
      <img src={`${API_BASE_URL}/images/${photo.file_name}`} alt="" className="photo-img" />
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {formatDateTime(photo.date_time)}
        </Typography>
        <Divider className="photo-divider" />
        {(photo.comments || []).map((c) => (
          <Typography key={c._id} variant="body2" className="photo-comment">
            <Typography component="span" variant="caption" color="text.secondary" display="block">
              {formatDateTime(c.date_time)}
            </Typography>
            <MuiLink component={Link} to={`/users/${c.user._id}`}>
              {c.user.first_name} {c.user.last_name}
            </MuiLink>
            {" "}
            {c.comment}
          </Typography>
        ))}
        <Stack direction="row" spacing={1} className="photo-comment-form">
          <TextField
            size="small"
            fullWidth
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
          />
          <Button variant="contained" onClick={onAddComment}>
            Add
          </Button>
        </Stack>
        {error && <Typography color="error" variant="caption">{error}</Typography>}
      </CardContent>
    </Card>
  );
}
