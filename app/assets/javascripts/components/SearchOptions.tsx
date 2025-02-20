import { AppState } from '@/ui_models/app_state';
import { toDirective, useAutorunValue } from './utils';
import { useRef, useState } from 'preact/hooks';
import { WebApplication } from '@/ui_models/application';
import VisuallyHidden from '@reach/visually-hidden';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure';
import { FocusEvent } from 'react';
import { Switch } from './Switch';
import TuneIcon from '../../icons/ic_tune.svg';

type Props = {
  appState: AppState;
  application: WebApplication;
};

function SearchOptions({ appState }: Props) {
  const { searchOptions } = appState;

  const {
    includeProtectedContents,
    includeArchived,
    includeTrashed,
  } = useAutorunValue(
    () => ({
      includeProtectedContents: searchOptions.includeProtectedContents,
      includeArchived: searchOptions.includeArchived,
      includeTrashed: searchOptions.includeTrashed,
    }),
    [searchOptions]
  );

  const [
    togglingIncludeProtectedContents,
    setTogglingIncludeProtectedContents,
  ] = useState(false);

  async function toggleIncludeProtectedContents() {
    setTogglingIncludeProtectedContents(true);
    try {
      await searchOptions.toggleIncludeProtectedContents();
    } finally {
      setTogglingIncludeProtectedContents(false);
    }
  }

  const [open, setOpen] = useState(false);
  const [optionsPanelTop, setOptionsPanelTop] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>();
  const panelRef = useRef<HTMLDivElement>();

  function closeOnBlur(event: FocusEvent<HTMLElement>) {
    if (
      !togglingIncludeProtectedContents &&
      !panelRef.current.contains(event.relatedTarget as Node)
    ) {
      setOpen(false);
    }
  }

  return (
    <Disclosure
      open={open}
      onChange={() => {
        const { height } = buttonRef.current.getBoundingClientRect();
        setOptionsPanelTop(height);
        setOpen((prevOpen) => !prevOpen);
      }}
    >
      <DisclosureButton
        ref={buttonRef}
        onBlur={closeOnBlur}
        className="sn-icon-button color-neutral hover:color-info"
      >
        <VisuallyHidden>Search options</VisuallyHidden>
        <TuneIcon className="fill-current block" />
      </DisclosureButton>
      <DisclosurePanel
        ref={panelRef}
        style={{
          top: optionsPanelTop,
        }}
        className="sn-dropdown sn-dropdown-anchor-right grid gap-2 py-2"
      >
        <Switch
          checked={includeProtectedContents}
          onChange={toggleIncludeProtectedContents}
          onBlur={closeOnBlur}
        >
          <p className="capitalize">Include protected contents</p>
        </Switch>
        <Switch
          checked={includeArchived}
          onChange={searchOptions.toggleIncludeArchived}
          onBlur={closeOnBlur}
        >
          <p className="capitalize">Include archived notes</p>
        </Switch>
        <Switch
          checked={includeTrashed}
          onChange={searchOptions.toggleIncludeTrashed}
          onBlur={closeOnBlur}
        >
          <p className="capitalize">Include trashed notes</p>
        </Switch>
      </DisclosurePanel>
    </Disclosure>
  );
}

export const SearchOptionsDirective = toDirective<Props>(SearchOptions);
