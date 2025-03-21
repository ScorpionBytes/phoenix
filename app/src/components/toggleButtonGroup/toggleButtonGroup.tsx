import React from "react";
import {
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
} from "react-aria-components";
import { css } from "@emotion/react";

import { classNames } from "@phoenix/components";
import { SizingProps, StylableProps } from "@phoenix/components/types";

const baseToggleButtonGroupCSS = css(`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;

  font-size: var(--ac-global-dimension-static-font-size-100);

  & > .ac-toggle-button:not(:first-child):not([data-selected="true"]) {
    border-left: none;
  }

  & > .ac-toggle-button:first-child {
    border-radius: var(--ac-global-rounding-small) 0 0 var(--ac-global-rounding-small);
  }

  & > .ac-toggle-button:last-child {
    border-radius: 0 var(--ac-global-rounding-small) var(--ac-global-rounding-small) 0;
  }

  &[data-size="S"] {
    .ac-toggle-button {
      min-height: unset;
      padding: var(--ac-global-dimension-size-25) var(--ac-global-dimension-size-100);
    }
  }

  &[data-size="L"] {
    .ac-toggle-button {
      padding: var(--ac-global-dimension-size-100) var(--ac-global-dimension-size-150);
    }
  }

  &:has(.ac-toggle-button[data-focus-visible]) {
    border-radius: var(--ac-global-rounding-small);
    outline: 1px solid var(--ac-global-input-field-border-color-active);
    outline-offset: 1px;
  }
`);

export type ToggleButtonGroupProps = AriaToggleButtonGroupProps;

export const ToggleButtonGroup = ({
  size,
  css: cssProp,
  className,
  selectionMode = "single",
  ...props
}: ToggleButtonGroupProps & SizingProps & StylableProps) => {
  return (
    <AriaToggleButtonGroup
      data-size={size}
      className={classNames("ac-toggle-button-group", className)}
      css={css(baseToggleButtonGroupCSS, cssProp)}
      selectionMode={selectionMode}
      {...props}
    />
  );
};
