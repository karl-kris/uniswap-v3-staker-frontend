import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface Star {
  cx: string;
  cy: string;
  r: number;
}

const useStyles = makeStyles((theme) => ({
  starsWrapper: {
    position: 'absolute',
    pointerEvents: 'none',
    width: '100vw',
    height: '60vh',
    overflow: 'hidden',
  },
  star: {
    fill: '#67e8f9',
  },
  comet: {
    transformOrigin: 'center center',
  },
}));

const Stars = () => {
  // Anotación de tipo explícita para el estado 'stars'
  const [stars, setStars] = useState<Star[]>([]);
  const classes = useStyles();

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const maxStars = isMobile ? 150 : 200;

    const newStars: Star[] = Array.from({ length: maxStars }, () => ({
      cx: Math.random() * 100 + '%',
      cy: Math.random() * 100 + '%',
      r: Math.round((Math.random() + 0.5) * 10) / 10,
    }));

    setStars(newStars);
  }, []);

  return (
    <div className={classes.starsWrapper}>
      {[...Array(3).keys()].map((n) => (
        <svg
          key={n}
          className='stars'
          width='100%'
          height='100%'
          preserveAspectRatio='none'
        >
          {stars.map((star, index) => (
            <circle
              key={index}
              className={classes.star}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
            />
          ))}
        </svg>
      ))}
      <svg
        className='extras'
        width='100%'
        height='100%'
        preserveAspectRatio='none'
      >
        <defs>
          <radialGradient id='comet-gradient' cx='0' cy='.5' r='0.5'>
            <stop offset='0%' stopColor='rgba(255,255,255,.8)' />
            <stop offset='100%' stopColor='rgba(255,255,255,0)' />
          </radialGradient>
        </defs>
        {[
          ['-135', 'a', '0', '0'],
          ['20', 'b', '100%', '0'],
          ['300', 'c', '40%', '100%'],
        ].map((comet, index) => (
          <g key={index} transform={`rotate(${comet[0]})`}>
            <ellipse
              className={classes.comet}
              fill={`url(#comet-gradient)`}
              cx={comet[2]}
              cy={comet[3]}
              rx='150'
              ry='2'
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default Stars;
