import { observer } from "mobx-react-lite";
import CircularProgress from "@mui/material/CircularProgress";
import { exchangeStore } from "../stores/exchangeStore";
import styled from "styled-components";
import { Typography } from "@mui/material";

const Container = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
`;

export const Rate = observer(() => {
  const sourceCoin = exchangeStore.coins.find(
    (c) => c.id === exchangeStore.sourceCurrency
  );
  const targetCoin = exchangeStore.coins.find(
    (c) => c.id === exchangeStore.targetCurrency
  );

  const loading = !sourceCoin || !targetCoin || exchangeStore.isLoadingRate;
  return (
    <Container>
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <Typography variant="body1">
          1 {sourceCoin?.symbol || ""} = {exchangeStore.exchangeRate}{" "}
          {targetCoin?.symbol || ""}
        </Typography>
      )}
    </Container>
  );
});
