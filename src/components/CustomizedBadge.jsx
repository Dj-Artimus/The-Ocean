import * as React from "react";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 19,
    border: `1.5px solid`,
    padding: "0 4px",
  },
}));

export default function CustomizedBadges({ children, count }) {

  return (
    <div className="mt-3">
      <IconButton aria-label="cart">
        {count === 0 ? (
          <StyledBadge badgeContent={0} color="primary">
            {children}
          </StyledBadge>
        ) : (
          <StyledBadge badgeContent={count} color="primary">
            {children}
          </StyledBadge>
        )}
      </IconButton>
    </div>
  );
}
