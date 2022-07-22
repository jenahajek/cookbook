import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const getCloudinaryImageUrl = ({ name, size = "400" }) =>
  `https://res.cloudinary.com/cookbookjenahajek/image/upload/q_auto,f_auto,ar_1:1,c_fill,w_${size},h_${size}/v1656021400/${name}.jpg`;

const CloudinaryImage = ({ name, size, className }) => {
  const url = getCloudinaryImageUrl({ name, size });
  return (
    <LazyLoadImage
      className={className}
      style={{ marginBottom: "0" }}
      alt={name}
      height={size}
      src={url}
      width={size}
    />
  );
};

export default CloudinaryImage;
