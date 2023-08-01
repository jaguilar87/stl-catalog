import React from 'react';
import { CircularProgress } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

import { useWs } from '@/services/providers/WSProvider';
import { COMMANDS } from '@/utils/constants';

type PropTypes = {
  path: string;
  height?: string;
};

export function Gallery({ path, height }: PropTypes) {
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
    <Carousel>
      {images.map((image) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={image}
          src={`/api/image?path=${image}`}
          alt="..."
          loading="lazy"
          style={{ maxHeight: height, maxWidth: '100%', margin: '0 auto' }}
        />
      ))}
    </Carousel>
  );
}
