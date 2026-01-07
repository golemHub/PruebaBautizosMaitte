import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function useAOS() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
      delay: 100,
    });

    // Cleanup
    return () => {
      AOS.refresh();
    };
  }, []);
}

export default useAOS;
