import { Box, Paper } from "@mui/material";
import SiteCard from "../CardComponents/SiteCard";
import PilerCard from "../CardComponents/PilerCard";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom";

export default function SiteManagerView() {
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch({ type: "FETCH_SITE", payload: id });
    dispatch({type: 'FETCH_ALERTS'})
  }, []);
  const siteData = useSelector((store) => store.site);
  const alerts = useSelector(store => store.alerts)
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          flex: 1,
        }}
      >
        {siteData && siteData.pilers && siteData.pilers.length > 0 ? (
          siteData.pilers.map((piler) => (
            <PilerCard key={piler.piler_id} data={piler} />
          ))
        ) : (
          <div></div>
        )}
      </Box>
      <Box sx={{ flex: '0 1 250px', marginLeft: 2 }}>
        {siteData && siteData.pilers && alerts && alerts.length > 0 && siteData.pilers.length > 0 ? <SiteCard /> : <div>No site Data</div>}
      </Box>
    </Box>
  );
}
