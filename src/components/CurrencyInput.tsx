import { observer } from "mobx-react-lite";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { FilterOptionsState } from "@mui/material";

const Container = styled.div`
  margin-top: 20px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

interface Coin {
  id: number;
  name: string;
  symbol: string;
}

interface CurrencyInputProps {
  label: string;
  amount: string;
  currencyId: number;
  onCurrencyChange: (value: number) => void;
  coins: Coin[];
  isLoading: boolean;
  isLoadingCoins: boolean;
  onAmountChange: (value: string) => void;
}

export const CurrencyInput = observer(
  ({
    label,
    amount,
    currencyId,
    onAmountChange,
    onCurrencyChange,
    coins,
    isLoading,
    isLoadingCoins,
  }: CurrencyInputProps) => {
    const [inputValue, setInputValue] = useState(amount);
    const [debouncedValue] = useDebounce(inputValue, 1000);
    const [error, setError] = useState<string | null>(null);
    const isUserUpdate = useRef(false);

    useEffect(() => {
      if (!isUserUpdate.current) {
        setInputValue(amount);
      }
    }, [amount]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      isUserUpdate.current = true;

      if (value === "") {
        setInputValue("");
        return;
      }
      if (parseFloat(value) <= 0 || isNaN(parseFloat(value))) {
        setError("Please enter a positive number");
      } else {
        setError(null);
        setInputValue(value);
      }
    };

    useEffect(() => {
      if (isUserUpdate.current) {
        onAmountChange(debouncedValue);
        isUserUpdate.current = false;
      }
    }, [debouncedValue, onAmountChange]);

    const filterOptions = (options: Coin[], state: FilterOptionsState<Coin>) =>
      options.filter(
        (option) =>
          option.symbol
            .toLowerCase()
            .startsWith(state.inputValue.toLowerCase()) ||
          option.name.toLowerCase().startsWith(state.inputValue.toLowerCase())
      );

    return (
      <Container>
        <InputWrapper>
          <Autocomplete
            options={coins}
            filterOptions={filterOptions}
            getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
            value={coins.find((c) => c.id === currencyId) || null}
            onChange={(_, newValue) =>
              newValue && onCurrencyChange(newValue.id)
            }
            renderInput={(params) => (
              <TextField {...params} label={`Select ${label} currency`} />
            )}
          />
          {isLoadingCoins && (
            <CircularProgress
              size={24}
              sx={{ position: "absolute", right: 40, top: 15 }}
            />
          )}
        </InputWrapper>
        <InputWrapper>
          <TextField
            fullWidth
            type="number"
            label={`${label} amount`}
            value={inputValue}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
            error={!!error}
            helperText={error}
          />
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{ position: "absolute", right: 40, top: 30 }}
            />
          )}
        </InputWrapper>
      </Container>
    );
  }
);
