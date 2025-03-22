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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const [openBottomSheet, setOpenBottomSheet] = React.useState(false);

  return (
    <>
      {/* Mobile View */}
      <Sheet open={openBottomSheet} onOpenChange={setOpenBottomSheet}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openBottomSheet}
            className="w-full sm:w-[250px] flex sm:hidden mt-1"
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
        </SheetTrigger>
        <SheetContent
          side="bottom"
          onInteractOutside={() => setOpenBottomSheet(false)}
        >
          <SheetHeader className="pb-0">
            <SheetTitle>Select Currency</SheetTitle>
          </SheetHeader>
          <Command>
            <CommandInput placeholder="Search currencies..." className="h-9" />
            <CommandList>
              <CommandEmpty>No currency found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(Currencies).map(([code, curr]) => (
                  <CommandItem
                    key={code}
                    value={`${code} ${curr.name}`}
                    onSelect={() => {
                      onValueChange(value === code ? "" : code);
                      setOpenBottomSheet(false);
                    }}
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
        </SheetContent>
      </Sheet>

      {/* Desktop View */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full sm:w-[250px] hidden sm:flex"
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
            <CommandInput placeholder="Search currencies..." className="h-9" />
            <CommandList>
              <CommandEmpty>No currency found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(Currencies).map(([code, curr]) => (
                  <CommandItem
                    key={code}
                    value={`${code} ${curr.name}`}
                    onSelect={() => {
                      onValueChange(value === code ? "" : code);
                      setOpen(false);
                    }}
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
    </>
  );
}
