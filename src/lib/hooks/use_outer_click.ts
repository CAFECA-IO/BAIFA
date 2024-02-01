import {useEffect, useRef, useState} from 'react';

function useOuterClick<T extends HTMLElement>(initialVisibleState: boolean) {
  const [componentVisible, setComponentVisible] = useState<boolean>(initialVisibleState);
  const targetRef = useRef<T>(null);

  function handleClickOutside(this: Document, event: MouseEvent): void {
    if (event.target instanceof HTMLElement && !targetRef.current?.contains(event.target)) {
      setComponentVisible(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {targetRef: targetRef, componentVisible: componentVisible, setComponentVisible};
}

export default useOuterClick;
