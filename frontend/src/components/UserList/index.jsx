import { Fragment } from "react";
import { Chip, Divider, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import useApi from "../../lib/useApi";
import "./styles.css";

export default function UserList({ currentUser }) {
  const { data } = useApi(currentUser ? "/user/list" : null, [currentUser]);
  const users = data || [];

  if (!currentUser) {
    return (
      <Typography variant="body2" color="text.secondary">
        Please login to see users
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h6" className="user-list-title" component={Link} to="/users">
        Users
      </Typography>
      <List>
        {users.map((user) => (
          <Fragment key={user._id}>
            <ListItem
              disablePadding
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={user.photo_count ?? 0}
                    color="success"
                    size="small"
                    component={Link}
                    to={`/photos/${user._id}`}
                    clickable
                  />
                  <Chip
                    label={user.comment_count ?? 0}
                    color="error"
                    size="small"
                    component={Link}
                    to={`/comments/${user._id}`}
                    clickable
                  />
                </Stack>
              }
            >
              <ListItemButton component={Link} to={`/users/${user._id}`}>
                <ListItemText primary={`${user.first_name} ${user.last_name}`} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </Fragment>
        ))}
      </List>
    </div>
  );
}
