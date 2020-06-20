import { useState, useCallback } from 'react';

// window.setTimeout(ticker, MIN_SPINNER_SHOW_TIME - elapsed);

/**
 *
 * @param delaySpinnerMs milliseconds to wait before showing spinner
 * @param minSpinnerMs minimum milliseconds to show spinner
 * @returns [setLoading, showSpinner, isLoading]
 */
export default function useDelayedLoading(
  delaySpinnerMs: number = 500,
  minSpinnerMs: number = 500
) {
  const [loadingState, setLoadingState] = useState<{
    startedLoading?: number;
    startedSpinner?: number;
    showSpinnerTimeoutId?: number;
    hideSpinnerTimeoutId?: number;
  }>({});

  const setLoading = useCallback(
    (isLoading: boolean) => {
      /**
       * Started loading
       */
      if (isLoading) {
        setLoadingState(loadingState => {
          /**
           * Clear all existing timeouts
           * Edge case: calling setLoading(true) when already loading
           */
          window.clearTimeout(loadingState.showSpinnerTimeoutId);
          window.clearTimeout(loadingState.hideSpinnerTimeoutId);

          return {
            startedLoading: Date.now(),
            showSpinnerTimeoutId: window.setTimeout(() => {
              setLoadingState(newLoadingState => {
                // Is this check needed if this gets cleared on setLoading(false)
                if (
                  newLoadingState.startedLoading &&
                  Date.now() - newLoadingState.startedLoading > delaySpinnerMs
                ) {
                  return { ...newLoadingState, startedSpinner: Date.now() };
                }
                return newLoadingState;
              });
            }, delaySpinnerMs)
            // startedSpinner: loadingState.startedSpinner // if already showing spinner, reset
          };
        });
      }

      //
      /**
       * Stopped loading
       */
      else {
        setLoadingState(loadingState => {
          /**
           * Clear loadingTimer
           *
           * Edge case: setLoading(false) when already false
           * Do not clear the hide spinner timer, want to keep orginal timeout function
           *
           * If there is already a function to clear the spinner, clear loading state and return
           */
          window.clearTimeout(loadingState.showSpinnerTimeoutId);
          // if (loadingState.hideSpinnerTimeoutId) {
          //   return {
          //     ...loadingState,
          //     startedLoading: undefined,
          //     showSpinnerTimeoutId: undefined
          //   };
          // }

          /**
           * Currently showing spinner
           */
          if (loadingState.startedSpinner) {
            const elapsedSpinnerTime = Date.now() - loadingState.startedSpinner;

            /**
             * Have shown spinner for required time, hide and set all to false
             */
            if (elapsedSpinnerTime > minSpinnerMs) {
              window.clearTimeout(loadingState.hideSpinnerTimeoutId);
              return {};
            }

            /**
             * Have not shown spinner for required time, hide spinner in the future
             */
            return {
              ...loadingState,
              hideSpinnerTimeoutId: window.setTimeout(() => {
                setLoadingState(newLoadingState => {
                  window.clearTimeout(newLoadingState.showSpinnerTimeoutId);
                  window.clearTimeout(newLoadingState.hideSpinnerTimeoutId);
                  return {};
                });
              }, minSpinnerMs - elapsedSpinnerTime)
            };
          }

          /**
           * Currently not showing spinner,
           * - clear all values
           * - clear any old hide spinner timeouts -- no spinner to hide
           */
          window.clearTimeout(loadingState.hideSpinnerTimeoutId);
          return {};
        });
      }
    },

    // only change if the config is changed
    [delaySpinnerMs, minSpinnerMs]
  );

  // is there a way to guarantee all timer's are cleared?
  // useEffect(() => {
  //   return () => window.clearTimeout(loadingState.timerId);
  // }, []);

  console.log('useDelayedLoading recomputed');

  return [
    setLoading,
    !!loadingState.startedSpinner,
    !!loadingState.startedLoading
  ] as const;
}
