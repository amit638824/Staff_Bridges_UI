'use client';

import React, { useRef } from 'react';
import AsyncSelect from 'react-select/async';

const ServerSearchSelect = ({
  placeholder = 'Search...',
  value,
  onChange,
  fetchOptions,
  getOptionLabel = (item: any) => item.name,
  getOptionValue = (item: any) => item.id,
  isMulti = false,
}: any) => {
  const abortRef = useRef<AbortController | null>(null);

  const loadOptions = async (inputValue: string) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetchOptions(inputValue, {
        signal: controller.signal,
      });

      // FIX IS HERE
      const items = res?.data?.items ?? [];

      return items.map((item: any) => ({
        label: getOptionLabel(item),
        value: getOptionValue(item),
        original: item,
      }));
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        return [];
      }
      console.error('Dropdown fetch error:', error);
      return [];
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isClearable
      isMulti={isMulti}
    />
  );
};

export default ServerSearchSelect;
