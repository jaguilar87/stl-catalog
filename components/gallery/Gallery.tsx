import React from 'react';
import { CircularProgress } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

import { useWs } from '@/services/providers/WSProvider';
import { COMMANDS } from '@/utils/constants';

type PropTypes = {
  path: string;
  className?: string;
};

export function Gallery({ path, className = 'h-[600px]' }: PropTypes) {
  const [isLoading, setisLoading] = React.useState<boolean>(true);
  const [images, setImages] = React.useState<string[]>([]);
  const { socket } = useWs();

  React.useEffect(() => {
    socket?.emit(COMMANDS.GET_GALLERY, path, (payload: string[]) => {
      setImages(payload);
      setisLoading(false);
    });
  }, [path, socket]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!images.length) {
    return <p>No images found</p>;
  }

  return (
    <div className={className}>
      <Carousel>
        {images.map((image) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={image} src={`/api/image?path=${image}`} alt="..." />
        ))}
      </Carousel>
    </div>
  );
}
