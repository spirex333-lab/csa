'use client';

import { useEffect, useState } from 'react';
import { ArrowLeftRight, HelpCircle } from 'lucide-react';
import { useSwapForm } from '@workspace/commons/hooks/useSwapForm';
import { CurrencyDto } from '@workspace/commons/dtos/change-now/currency.dto';
import { SwapPanel, RateDisplay } from '@workspace/eds/swap';
import { Button } from '@workspace/eds';
import { Input } from '@workspace/eds';
import { RateType } from '@workspace/commons/dtos/change-now/create-order.dto';
import Image from 'next/image';
import logo from '../../../../../public/logo.svg';
import { AppLogo } from '@webapp/components/common/logo';
export default function SwapPage() {
  const {
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
  } = useSwapForm();

  const [currencies, setCurrencies] = useState<CurrencyDto[]>([]);

  useEffect(() => {
    fetch('/api/swap/currencies')
      .then((r) => r.json())
      .then(setCurrencies)
      .catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const fromAmount = watch('fromAmount');

  const onSubmit = handleSubmit(async (values) => {
    if (!fromCurrency || !toCurrency) return;
    await fetch('/api/swap/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromCanonical: fromCurrency.canonicalTicker,
        toCanonical: toCurrency.canonicalTicker,
        fromAmount: parseFloat(values.fromAmount),
        toAddress: values.toAddress,
        rateType,
        rateId: quote?.rateId,
      }),
    });
  });

  const rateSubLabel = (
    <RateDisplay
      quote={quote}
      loading={quoteLoading}
      fromTicker={fromCurrency?.canonicalTicker}
      toTicker={toCurrency?.canonicalTicker}
    />
  );

  return (
    <div
      style={{ backgroundImage: 'url(/landing-bg.webp)' }}
      className="bg-cover bg-size-[50%] flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 p-6"
    >
      <div className="w-full max-w-5xl">
        {/* Hero */}
        <div className="mb-8 flex flex-col items-center text-center text-purple-700 ">
          <div className="w-20">
            <AppLogo />
          </div>
          {/* <Image src={logo} width={250} height={200} alt="Logo" className="mx-auto mb-4 h-20 w-auto" /> */}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Swap Pilot
          </h1>
          <h3 className="text-base font-medium tracking-tight text-slate-500">
            Get the best exchange rates from Trusted Crypto Swap Platforms
          </h3>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-indigo-100/60 ring-1 ring-slate-100">
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            {/* ── Row 1: Send ⇄ Receive ── */}
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
              <SwapPanel
                label="Send"
                amount={fromAmount}
                onAmountChange={(v) => form.setValue('fromAmount', v)}
                amountError={errors.fromAmount?.message}
                currency={fromCurrency}
                currencies={currencies}
                onCurrencyChange={setFromCurrency}
                subLabel={rateSubLabel}
              />

              <button
                type="button"
                onClick={reversePair}
                aria-label="Reverse pair"
                className="mx-auto mt-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:scale-110 hover:border-indigo-400 hover:text-indigo-500 sm:mt-7"
              >
                <ArrowLeftRight size={16} />
              </button>

              <SwapPanel
                label="Receive"
                amount={quote ? String(quote.toAmount) : ''}
                readOnly
                loading={quoteLoading}
                currency={toCurrency}
                currencies={currencies}
                onCurrencyChange={setToCurrency}
              />
            </div>

            {quoteError && <p className="text-xs text-red-500">{quoteError}</p>}

            {/* ── Row 2: Destination address ── */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Destination address
                {toCurrency && (
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-500">
                    {toCurrency.canonicalTicker}
                  </span>
                )}
              </label>
              <Input
                placeholder={
                  toCurrency
                    ? `Your ${toCurrency.canonicalTicker} address`
                    : 'Enter recipient wallet address'
                }
                {...register('toAddress', {
                  required: 'Destination address is required',
                })}
                className={`h-12 rounded-xl px-4 text-sm ${
                  errors.toAddress
                    ? 'border-red-400 focus-visible:ring-red-400'
                    : ''
                }`}
              />
              {errors.toAddress && (
                <p className="text-xs text-red-500">
                  {errors.toAddress.message}
                </p>
              )}
            </div>

            {/* ── Row 3: Rate toggle tabs + CTA ── */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setRateType(RateType.FIXED)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                  rateType === RateType.FIXED
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                Fixed rate
              </button>

              <button
                type="button"
                onClick={() => setRateType(RateType.FLOAT)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                  rateType === RateType.FLOAT
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                Float rate
              </button>

              <button
                type="button"
                aria-label="Rate type info"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
              >
                <HelpCircle size={16} />
              </button>

              <div className="flex-1" />

              <Button
                type="submit"
                disabled={
                  isSubmitting || !fromCurrency || !toCurrency || !quote
                }
                className="h-12 rounded-2xl bg-indigo-600 px-8 text-white text-base font-semibold tracking-wide shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 disabled:opacity-40"
              >
                {isSubmitting ? 'Creating order…' : 'Exchange now →'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
