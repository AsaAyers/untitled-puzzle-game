import classNames from 'classnames';
import React from 'react';
import type { State } from './app-state';

// https://stackoverflow.com/a/51847335
/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 */
interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: Array<string>;

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<void>;
}

type InstallPromptProps = {
  className: string;
  state: State;
};
export function InstallPrompt({
  className,
  state,
}: InstallPromptProps): JSX.Element | null {
  const [
    deferredPrompt,
    setPrompt,
  ] = React.useState<BeforeInstallPromptEvent | null>(null);

  React.useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      console.log('beforeinstallevent', e);
    });
  }, []);

  const handleClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    setPrompt(null);
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
  };

  if (!deferredPrompt || !state.gameOver) {
    return null;
  }

  return (
    <div
      className={classNames(
        className,
        'bg-body z-50 rounded-xl flex flex-row justify-center align-middle',
      )}
    >
      <button onClick={handleClick} className="app-btn my-auto">
        Install Block Puzzle
      </button>
    </div>
  );
}
