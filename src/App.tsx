import { observer } from "mobx-react-lite";
import { exchangeStore } from "./stores/exchangeStore";
import { CurrencyInput } from "./components/CurrencyInput";
import Button from "@mui/material/Button";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import { Rate } from "./components/Rate";

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
`;

const App = observer(() => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Crypto Exchange
      </Typography>

      <CurrencyInput
        label="Source"
        amount={exchangeStore.sourceAmount}
        currencyId={exchangeStore.sourceCurrency}
        onAmountChange={exchangeStore.setSourceAmount}
        onCurrencyChange={exchangeStore.setSourceCurrency}
        coins={exchangeStore.coins}
        isLoading={exchangeStore.isLoadingSource}
        isLoadingCoins={exchangeStore.isLoadingCoins}
      />

      <div style={{ textAlign: "center", margin: "20px" }}>
        <Button
          variant="outlined"
          onClick={exchangeStore.swapCurrencies}
          startIcon={<SwapHorizIcon />}
        >
          Swap Currencies
        </Button>
      </div>

      <CurrencyInput
        label="Target"
        amount={exchangeStore.targetAmount}
        currencyId={exchangeStore.targetCurrency}
        onAmountChange={exchangeStore.setTargetAmount}
        onCurrencyChange={exchangeStore.setTargetCurrency}
        coins={exchangeStore.coins}
        isLoading={exchangeStore.isLoadingTarget}
        isLoadingCoins={exchangeStore.isLoadingCoins}
      />

      <Rate />
    </Container>
  );
});

export default App;
