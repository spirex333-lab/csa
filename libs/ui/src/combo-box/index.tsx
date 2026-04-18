'use client';
import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../button';
import { Command, CommandInput, CommandItem, CommandList } from '../command';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Label } from '../label';

export type SearchComboBoxItem = {
  id?: string;
  [k: string]: any;
};

export type SearchComboBoxProps = {
  items?: SearchComboBoxItem[];
  searchKeys?: string[];
  displayKeys?: string[];
  onChange?: (value: SearchComboBoxItem) => void;
  onQuery?: (value: string) => void;
  value?: SearchComboBoxItem;
  defaultValue?: SearchComboBoxItem;
};

export const SearchComboBox = ({
  items,
  searchKeys = ['name', 'title'],
  displayKeys,
  onChange,
  onQuery,
  value,
  defaultValue,
}: SearchComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(selected)) {
      setSelected(value);
    }
  }, [value, selected]);

  const filteredItems = items?.filter((item) => {
    for (const key of searchKeys ?? []) {
      if (item?.[key]?.toLowerCase().includes(query.toLowerCase())) {
        console.log(
          item?.[key],
          query,
          item?.[key]?.toLowerCase().includes(query.toLowerCase())
        );
        return true;
      }
    }
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full  justify-between">
          {displayKeys?.length
            ? displayKeys?.map((k) => selected?.[k])?.join?.(' ')
            : selected?.title ??
              selected?.name ??
              selected?.id ??
              'Select an option'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <Command onChange={onChange}>
          <CommandInput
            placeholder="Search..."
            value={query}
            onValueChange={(v) => {
              setQuery(v);
              onQuery?.(v);
            }}
          />
          <div className="flex flex-col gap-0">
            <div className="flex items-start"></div>
          </div>
          {filteredItems?.length && filteredItems?.length > 0 ? (
            filteredItems?.map((item, itemIndex) => (
              <a className="border-b" key={item?.id + '-' + itemIndex}>
                <Label
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelected(item);
                    onChange?.(item);
                  }}
                >
                  {displayKeys?.length
                    ? displayKeys?.map((k) => selected?.[k])?.join?.(' ')
                    : item?.title ?? item?.name ?? item?.id}
                  {selected === item?.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </Label>
              </a>
            ))
          ) : (
            <Label className="p-4">No results found.</Label>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
