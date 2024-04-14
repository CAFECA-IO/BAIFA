// Info: (20240401 - Julian) If someone goes to /explorer/isuncoin, we should push them to /app/chains/8017
import {useRouter} from 'next/router';
import {useEffect} from 'react';

export default function IsuncoinExplorerPage() {
  const router = useRouter();
  useEffect(() => {
    router.push('/app/chains/8017');
  }, []);
  return null;
}
