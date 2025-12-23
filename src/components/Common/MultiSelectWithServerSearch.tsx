'use client';

import React, { useRef } from 'react';
import AsyncSelect from 'react-select/async';

type OptionType = {
  label: string;
  value: string | number;
  original: any;
};

type FetchConfig = {
  signal?: AbortSignal;
};

type Props = {
  placeholder?: string;
  value: OptionType | OptionType[] | null;
  onChange: (value: any) => void;
  fetchOptions: (search: string, config?: FetchConfig) => Promise<any>;
  getOptionLabel?: (item: any) => string;
  getOptionValue?: (item: any) => string | number;
  isMulti?: boolean;
};

const MultiSelectWithServerSearch: React.FC<Props> = ({
  placeholder = 'Search...',
  value,
  onChange,
  fetchOptions,
  getOptionLabel = (item) => item.name,
  getOptionValue = (item) => item.id,
  isMulti = false,
}) => {
  const abortRef = useRef<AbortController | null>(null);

  const loadOptions = async (inputValue: string): Promise<OptionType[]> => {
    // cancel previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetchOptions(inputValue, {
        signal: controller.signal,
      });

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
      classNamePrefix="react-select"
    />
  );
};

export default MultiSelectWithServerSearch;
