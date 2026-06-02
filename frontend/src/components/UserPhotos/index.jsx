import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import postJSON from "../../lib/postJSON";
import useApi from "../../lib/useApi";
import PhotoCard from "./PhotoCard";
import "./styles.css";

export default function UserPhotos({ advanced, refresh = 0 }) {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const [reload, setReload] = useState(0);
  const [texts, setTexts] = useState({});
  const [errors, setErrors] = useState({});
  const { data, loading, error } = useApi(`/photosOfUser/${userId}`, [userId, reload, refresh]);
  const photos = data || [];

  const addComment = async (id) => {
    const text = (texts[id] || "").trim();
    if (!text) {
      setErrors({ ...errors, [id]: "Comment cannot be empty" });
      return;
    }
    try {
      await postJSON(`/commentsOfPhoto/${id}`, { comment: text });
      setTexts({ ...texts, [id]: "" });
      setReload((n) => n + 1);
    } catch (e) {
      setErrors({ ...errors, [id]: e.message });
    }
  };

  if (error) return <Typography>Unable to load photos</Typography>;
  if (loading) return <Typography>Loading...</Typography>;
  if (!photos.length) return <Typography>No photos found</Typography>;

  if (advanced) {
    const idx = Math.max(0, photoId ? photos.findIndex((p) => p._id === photoId) : 0);
    const current = photos[idx];
    return (
      <Stack spacing={2}>
        <PhotoCard
          photo={current}
          text={texts[current._id] || ""}
          error={errors[current._id]}
          onTextChange={(value) => setTexts({ ...texts, [current._id]: value })}
          onAddComment={() => addComment(current._id)}
        />
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            startIcon={<ArrowBack />}
            disabled={idx === 0}
            onClick={() => navigate(`/photos/${userId}/${photos[idx - 1]._id}`)}
          >
            Previous
          </Button>
          <Typography className="photo-nav-count">
            {idx + 1} / {photos.length}
          </Typography>
          <Button
            endIcon={<ArrowForward />}
            disabled={idx === photos.length - 1}
            onClick={() => navigate(`/photos/${userId}/${photos[idx + 1]._id}`)}
          >
            Next
          </Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      {photos.map((p) => (
        <PhotoCard
          key={p._id}
          photo={p}
          text={texts[p._id] || ""}
          error={errors[p._id]}
          onTextChange={(value) => setTexts({ ...texts, [p._id]: value })}
          onAddComment={() => addComment(p._id)}
        />
      ))}
    </Stack>
  );
}
