// Info: (20240401 - Julian) If someone goes to /explorer/isuncoin, we should push them to /app/chains/8017
import {useEffect} from 'react';
import {useRouter} from 'next/router';

export default function IsuncoinExplorerPage() {
  const router = useRouter();
  useEffect(() => {
    router.push('/app/chains/8017');
  }, []);
  return null;
}
