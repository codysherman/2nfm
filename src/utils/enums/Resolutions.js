export const Resolutions = {
  FitScreen: 'FitScreen',
  Fit4K: 'Fit4K',
  Fit2K: 'Fit2K',
  Fit1080p: 'Fit1080p',
  Fit720p: 'Fit720p',
  Fit480p: 'Fit480p',
  Fit360p: 'Fit360p',
};

/**
 * @return dimensions { width: number, height: number }
 */
export const getDimensionsForResolution = (resolution) => {
  console.log('resolution:', resolution);
  switch (resolution) {
  case Resolutions.Fit4K:
    return { width: 3840, height: 2160 };
  case Resolutions.Fit2K:
    return { width: 2560, height: 1440 };
  case Resolutions.Fit1080p:
    return { width: 1920, height: 1080 };
  case Resolutions.Fit720p:
    return { width: 1280, height: 720 };
  case Resolutions.Fit480p:
    return { width: 720, height: 480 };
  case Resolutions.Fit360p:
    return { width: 640, height: 360 };
  case Resolutions.FitScreen:
  default:
    return (window || {}).screen || getDimensionsForResolution(Resolutions.Fit480p);
  }
};
