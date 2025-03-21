"use client";

import React from "react";
import Image from "next/image";
import { Currencies, imageUrl } from "@/lib/constant";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type CurrencySelectorProps = {
  value: keyof typeof Currencies;
  onValueChange: React.Dispatch<React.SetStateAction<keyof typeof Currencies>>;
};

export function CurrencySelector({
  value,
  onValueChange,
}: CurrencySelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-[250px]"
        >
          {value ? (
            <Image
              width={16}
              height={16}
              src={imageUrl(Currencies[value]?.code.toLowerCase())}
              alt={Currencies[value]?.name}
            />
          ) : null}
          <span className="text-left">
            {value ? Currencies[value]?.name : "Select currencies..."}
          </span>
          <ChevronsUpDown className="opacity-50 ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Select currencies..." className="h-9" />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {Object.entries(Currencies).map(([code, curr]) => (
                <CommandItem
                  key={code}
                  value={code}
                  onSelect={() => {
                    onValueChange(value === code ? "" : code);
                    setOpen(false);
                  }}
                  className={value === code ? "bg-red" : ""}
                >
                  <Image
                    width={16}
                    height={16}
                    src={imageUrl(curr.code.toLowerCase())}
                    alt={Currencies[code as keyof typeof Currencies].name}
                  />
                  {curr.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
