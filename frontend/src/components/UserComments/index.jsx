import { Card, CardContent, Divider, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import formatDateTime from "../../lib/formatDate";
import useApi from "../../lib/useApi";
import "./styles.css";

export default function UserComments() {
  const { userId } = useParams();
  const { data: comments = [], loading, error } = useApi(`/commentsOfUser/${userId}`, [userId]);

  if (error) return <Typography>Unable to load comments</Typography>;
  if (loading) return <Typography>Loading...</Typography>;
  if (!comments.length) return <Typography>No comments yet</Typography>;

  return (
    <Stack spacing={2}>
      {comments.map((c) => {
        const photoLink = `/photos/${c.photo_user_id}/${c.photo_id}`;
        return (
          <Card key={c._id} variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={2}>
                <MuiLink component={Link} to={photoLink} underline="none">
                  <img src={`${API_BASE_URL}/images/${c.file_name}`} alt="" className="comment-thumb" />
                </MuiLink>
                <Stack spacing={0.75} className="comment-body">
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(c.date_time)}
                  </Typography>
                  <Divider />
                  <Typography variant="body2">
                    <MuiLink component={Link} to={photoLink}>{c.comment}</MuiLink>
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
