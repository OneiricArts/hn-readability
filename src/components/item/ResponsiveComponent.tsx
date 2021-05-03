import React, { FC, ReactNode, useEffect, useState } from 'react';

/**
 * Render react component by breakpoints.
 *
 * Will render a component for specified screen size or above
 *  - unless there is a component specified at a higher screen size
 *
 * Inspired by Bootstrap breakpoints, and using save values.
 */

type ScreenSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ResponsiveComponentProps {
  xs?: ReactNode;
  sm?: ReactNode;
  md?: ReactNode;
  lg?: ReactNode;
  xl?: ReactNode;
}

const mqls = {
  // xs is default
  sm: window.matchMedia('(min-width: 576px)'),
  md: window.matchMedia('(min-width: 768px)'),
  lg: window.matchMedia('(min-width: 992px)'),
  xl: window.matchMedia('(min-width: 1200px)')
};

const matchMqls = (): ScreenSizes => {
  if (mqls.xl.matches) return 'xl';
  if (mqls.lg.matches) return 'lg';
  if (mqls.md.matches) return 'md';
  if (mqls.sm.matches) return 'sm';

  return 'xs';
};

export const ResponsiveComponent: FC<ResponsiveComponentProps> = props => {
  const [screenSize, setScreenSize] = useState<ScreenSizes>(matchMqls());

  useEffect(() => {
    const setScreenSizeCallback = () => setScreenSize(matchMqls());

    Object.values(mqls).forEach(mql =>
      mql.addEventListener('change', setScreenSizeCallback)
    );

    return () => {
      Object.values(mqls).forEach(mql =>
        mql.removeEventListener('change', setScreenSizeCallback)
      );
    };
  }, []);

  let component: ReactNode;

  const setXs = () => (component = props.xs);
  const setSm = () => (props.sm ? (component = props.sm) : setXs());
  const setMd = () => (props.md ? (component = props.md) : setSm());
  const setLg = () => (props.lg ? (component = props.lg) : setMd());
  const setXl = () => (props.xl ? (component = props.xl) : setLg());

  const sizeToFunc = {
    xs: setXs,
    sm: setSm,
    md: setMd,
    lg: setLg,
    xl: setXl
  } as const;

  sizeToFunc[screenSize]();

  return <>{component}</>;
};
