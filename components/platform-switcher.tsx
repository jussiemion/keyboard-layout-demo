'use client';

import { useRef, type RefObject } from 'react';
import { ChevronDown, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale } from '@/components/locale-provider';
import { PLATFORMS, platformNames, setPlatform } from '@/lib/platform';

export function PlatformSwitcher({
  onOpenChange,
  inputRef,
}: {
  onOpenChange: (open: boolean) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  const { platform, m, t } = useLocale();
  const selected = useRef(false);
  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          selected.current = false;
        }
        onOpenChange(open);
      }}
    >
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="language-trigger platform-trigger"
            aria-label={t('choosePlatform', {
              platform: platformNames[platform],
            })}
          />
        }
      >
        <Monitor size={16} aria-hidden="true" />
        <span>{platformNames[platform]}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="theme-menu"
        finalFocus={() => (selected.current ? inputRef.current : true)}
      >
        <DropdownMenuRadioGroup
          value={platform}
          onValueChange={(value) => {
            selected.current = true;
            setPlatform(value);
          }}
        >
          <DropdownMenuLabel>{m.platform}</DropdownMenuLabel>
          {PLATFORMS.map((value) => (
            <DropdownMenuRadioItem
              key={value}
              value={value}
              className="theme-menu-item"
            >
              {platformNames[value]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
