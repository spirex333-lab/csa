'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CurrencyDto } from '../dtos/change-now/currency.dto';
import { QuoteResponseDto } from '../dtos/change-now/quote.dto';
import { RateType } from '../dtos/change-now/create-order.dto';

export type SwapFormValues = {
  fromAmount: string;
  toAddress: string;
};

export type UseSwapFormReturn = {
  form: ReturnType<typeof useForm<SwapFormValues>>;
  fromCurrency: CurrencyDto | null;
  toCurrency: CurrencyDto | null;
  rateType: RateType;
  quote: QuoteResponseDto | null;
  quoteLoading: boolean;
  quoteError: string | null;
  setFromCurrency: (c: CurrencyDto) => void;
  setToCurrency: (c: CurrencyDto) => void;
  setRateType: (r: RateType) => void;
  reversePair: () => void;
};

export function useSwapForm(): UseSwapFormReturn {
  const form = useForm<SwapFormValues>({
    defaultValues: { fromAmount: '', toAddress: '' },
    mode: 'onChange',
  });

  const [fromCurrency, setFromCurrency] = useState<CurrencyDto | null>(null);
  const [toCurrency, setToCurrency] = useState<CurrencyDto | null>(null);
  const [rateType, setRateType] = useState<RateType>(RateType.FLOAT);
  const [quote, setQuote] = useState<QuoteResponseDto | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fromAmount = form.watch('fromAmount');

  useEffect(() => {
    if (!fromCurrency || !toCurrency || !fromAmount || parseFloat(fromAmount) <= 0) {
      setQuote(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setQuoteLoading(true);
      setQuoteError(null);
      try {
        const endpoint = rateType === RateType.FIXED ? 'fixed' : 'float';
        const params = new URLSearchParams({
          fromCurrency: fromCurrency.ticker,
          toCurrency: toCurrency.ticker,
          fromAmount,
          fromNetwork: fromCurrency.network,
          toNetwork: toCurrency.network,
        });
        const res = await fetch(`/api/swap/quote?type=${endpoint}&${params}`);
        if (!res.ok) throw new Error('Failed to fetch quote');
        const data: QuoteResponseDto = await res.json();
        setQuote(data);
      } catch {
        setQuoteError('Could not fetch rate. Please try again.');
        setQuote(null);
      } finally {
        setQuoteLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fromCurrency, toCurrency, fromAmount, rateType]);

  const reversePair = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    form.setValue('fromAmount', '');
    setQuote(null);
  };

  return {
    form,
    fromCurrency,
    toCurrency,
    rateType,
    quote,
    quoteLoading,
    quoteError,
    setFromCurrency,
    setToCurrency,
    setRateType,
    reversePair,
  };
}
