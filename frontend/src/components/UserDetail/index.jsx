import { Button, Stack, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import useApi from "../../lib/useApi";
import "./styles.css";

export default function UserDetail() {
  const { userId } = useParams();
  const { data: user, loading } = useApi(`/user/${userId}`, [userId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!user) return <Typography>User not found</Typography>;

  return (
    <Stack spacing={1.5}>
      <Typography variant="h5">
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body1">
        <strong>Location:</strong> {user.location}
      </Typography>
      <Typography variant="body1">
        <strong>Description:</strong> {user.description}
      </Typography>
      <Typography variant="body1">
        <strong>Occupation:</strong> {user.occupation}
      </Typography>
      <Button component={Link} to={`/photos/${user._id}`} variant="contained" className="view-photos-btn">
        View Photos
      </Button>
    </Stack>
  );
}
