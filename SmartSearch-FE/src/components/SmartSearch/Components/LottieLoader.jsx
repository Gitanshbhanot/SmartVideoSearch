import { useLottie } from "lottie-react";

export const LottieLoader = ({
  animationData = null,
  width = "240px",
  height = "240px",
}) => {
  const options = {
    animationData: animationData,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div
      style={{
        height,
        width,
      }}
    >
      {View}
    </div>
  );
};
