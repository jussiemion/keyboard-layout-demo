import { Fragment, type ReactNode } from 'react';

export function TranslatedText({
  message,
  values,
}: {
  message: string;
  values: Record<string, ReactNode>;
}) {
  return message
    .split(/(\{\w+\})/g)
    .map((token, index) => (
      <Fragment key={index}>
        {/^\{\w+\}$/.test(token) ? (
          <bdi>{values[token.slice(1, -1)] ?? token}</bdi>
        ) : (
          token
        )}
      </Fragment>
    ));
}
