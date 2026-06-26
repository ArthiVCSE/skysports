// app/(info)/terms/page.tsx
import { Box, Typography } from "@mui/material";

export default function TermsPage() {
  return (
    <Box sx={{ p: 4, maxWidth: "3xl", mx: "auto", color: "#e2e8f0" }}>
      <Typography variant="h4" sx={{ mb: 3, color: "#fff" }}>
        Terms & Conditions
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
        {/* Replace this placeholder with your actual terms and conditions. */}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan, metus
        ultrices eleifend gravida, nulla nunc varius lectus, nec rutrum justo nibh
        eu lectus. Ut vulputate semper dui. Fusce erat odio, sollicitudin vel
        erat vel, interdum mattis neque.
      </Typography>
    </Box>
  );
}
