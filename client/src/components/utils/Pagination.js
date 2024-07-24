import { Pagination } from "@mui/material/";

export default function PaginationComponent({
  numberOfPages,
  handleChange,
  page,
  className,
}) {
  return (
    <Pagination
      key={page}
      count={numberOfPages}
      page={page}
      onChange={handleChange}
    />
  );
}
