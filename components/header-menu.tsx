'use client';

import type { KeyboardLocale } from '@/lib/keyboard-locales';

import {
  headerMenuClasses,
  headerMenuValueClasses,
} from '@/components/layout-classes';

import { useRef, useState, type RefObject } from 'react';
import {
  Menu,
  BookOpen,
  Languages,
  Sun,
  Moon,
  CodeXml,
  Settings,
  GraduationCap,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DirectionProvider } from '@/components/ui/direction';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InterfaceLanguageSwitcher } from '@/components/interface-language-switcher';
import { useLocale } from '@/components/locale-provider';
import { type UiLocale, nativeLanguageNames } from '@/lib/messages';
import { headerMenuMessages } from '@/lib/header-menu-messages';
import { tourMessages } from '@/lib/tour-messages';
import { referencePath } from '@/lib/seo';
import seoCopy from '@/lib/seo-copy.json';
import { setThemePreference } from '@/lib/theme';

export function HeaderMenu({
  languagePriority,
  onUiLocaleChange,
  inputRef,
  triggerRef,
  onOpenChange,
  onSettingsOpen,
  onTourOpen,
  tourActive,
}: {
  languagePriority: readonly KeyboardLocale[];
  onUiLocaleChange: (locale: UiLocale) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onOpenChange: () => void;
  onSettingsOpen: () => void;
  onTourOpen: () => void;
  tourActive: boolean;
}) {
  const { m, t, uiLocale, theme } = useLocale();
  const text = headerMenuMessages[uiLocale];
  const [languageOpen, setLanguageOpen] = useState(false);
  const [languageSession, setLanguageSession] = useState(0);
  const openingDialog = useRef(false);
  const isDark = theme === 'vesper';
  const ThemeIcon = isDark ? Moon : Sun;
  const direction = ['he', 'ar'].includes(uiLocale) ? 'rtl' : 'ltr';

  return (
    <DirectionProvider direction={direction}>
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) {
            openingDialog.current = false;
          }
          onOpenChange();
        }}
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                render={
                  <Button
                    ref={triggerRef}
                    data-tour-target="settings"
                    variant="ghost"
                    size="icon"
                    className="icon-link"
                    aria-label={text.menu}
                  />
                }
              >
                <Menu size={20} aria-hidden="true" />
              </DropdownMenuTrigger>
            }
          />
          <TooltipContent>{text.menu}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent
          className={headerMenuClasses}
          align="end"
          sideOffset={8}
          dir={direction}
          finalFocus={() =>
            openingDialog.current ? false : triggerRef.current
          }
        >
          <DropdownMenuItem
            className="header-menu-item"
            onClick={() => {
              openingDialog.current = true;
              setLanguageSession((session) => session + 1);
              setLanguageOpen(true);
            }}
          >
            <Languages aria-hidden="true" />
            <span>{text.language}</span>
            <bdi className={headerMenuValueClasses}>
              {nativeLanguageNames[uiLocale]}
            </bdi>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="header-menu-item"
            closeOnClick={false}
            aria-label={`${text.theme}. ${t('chooseTheme', {
              theme: isDark ? m.themeLight : m.themeDark,
            })}`}
            onClick={() =>
              setThemePreference(isDark ? 'vesper_light' : 'vesper')
            }
          >
            <ThemeIcon aria-hidden="true" />
            <span>{text.theme}</span>
            <span className={headerMenuValueClasses}>
              {isDark ? m.themeDark : m.themeLight}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="header-menu-item"
            onClick={() => {
              openingDialog.current = true;
              onSettingsOpen();
            }}
          >
            <Settings aria-hidden="true" />
            <span>{text.settings}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="header-menu-item"
            disabled={tourActive}
            onClick={() => {
              openingDialog.current = true;
              onTourOpen();
            }}
          >
            <GraduationCap aria-hidden="true" />
            <span>{tourMessages[uiLocale].menu}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="header-menu-item"
            render={
              <a
                href={referencePath(uiLocale)}
                aria-label={seoCopy[uiLocale].referenceTitle}
              />
            }
          >
            <BookOpen aria-hidden="true" />
            <span>{seoCopy[uiLocale].referenceTitle}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="header-menu-item"
            render={
              <a
                aria-label={text.source}
                href="https://github.com/jussiemion/keyboard-layout-demo"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <CodeXml aria-hidden="true" />
            <span>{text.source}</span>
            <ArrowUpRight
              className={headerMenuValueClasses}
              aria-hidden="true"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <InterfaceLanguageSwitcher
        languagePriority={languagePriority}
        onValueChange={onUiLocaleChange}
        key={languageSession}
        open={languageOpen}
        returnFocusRef={triggerRef}
        inputRef={inputRef}
        onOpenChange={(open) => {
          setLanguageOpen(open);
          onOpenChange();
        }}
      />
    </DirectionProvider>
  );
}
