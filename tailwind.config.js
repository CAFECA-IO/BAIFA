/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkPurple: '#24274A',
        darkPurple2: '#2C315B',
        darkPurple3: '#1F2243',
        darkPurple4: '#3F497A',
        darkPurple5: '#161830',

        lightWhite: '#F2F2F2',

        lightGreen: '#3DD08C',
        lightGreen2: '#21AD6C',
        lightGreen3: '#53AE94',

        lightBlue: '#31D3F5',

        lightRed: '#FC8181',
        lightRed2: '#E96C67',

        lightOrange: '#F7931A',
        darkOrange: '#FFA600',

        lilac: '#ABA7BD',
        lilac2: '#6857d733',
        violet: '#6857D7',
        violet2: '#9747FF',

        bluePurple: '#627EEA',
        primaryBlue: '#11FFF5',
        'primaryBlue-500': 'rgba(17, 255, 245, 0.5)',
        hoverWhite: '#F0F0F0',

        lightGray: '#9ca3ae',
      },
      backgroundImage: {
        purpleLinear: 'linear-gradient(180deg, #3F497A 0%, #313866 100%)',
        purpleLinear2:
          'linear-gradient(315deg, rgba(104, 87, 215, 0.30) 0%, rgba(104, 87, 215, 0.10) 100%);',

        skeleton:
          'linear-gradient(0deg, rgba(123, 104, 238, 0.10) 0%, rgba(123, 104, 238, 0.10) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.08) 100%)',
        skeletonCube:
          'linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 48%, rgba(255, 255, 255, 0) 100%)',

        pipe: 'url("/elements/pipe.svg")',
        neon: 'url("/animations/neon.svg")',
        101: 'url("/elements/101.png")',
        lightBalls: 'url("/elements/light_balls.svg")',
        lightBallsReverse: 'url("/elements/light_balls_reverse.svg")',

        bubbleAbove: 'url("/elements/bubble_above.svg")',
        bubbleBelow: 'url("/elements/bubble_below.svg")',

        reportCover: 'url("/documents/cover.svg")',
        contentBg: 'url("/documents/content_bg.svg"), linear-gradient(#F2F2F2,#F2F2F2)',
        headerBg: 'url("/documents/header_bg.svg"), linear-gradient(#F2F2F2,#F2F2F2)',
      },
      fontSize: {
        xxs: ['10px', '12px'],
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '32px': ['32px', '36px'],
        '4xl': ['36px', '40px'],
        '40px': ['40px', '44px'],
        '5xl': ['42px', 1],
        '48px': ['48px', '52px'],
        '6xl': ['56px', '60px'],
        '7xl': ['72px', 1],
        '8xl': ['96px', 1],
        '9xl': ['128px', 1],
      },
      screens: {
        /* Info: (20230627 - Julian) 等同於 @media (min-width: ...px) */
        xxs: '370px',
        xs: '500px',
        a4: '595px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1600px',
      },
      spacing: {
        /* Info: (20230627 - Julian) 適用範圍
         * width / height / padding / margin / top / bottom / right / left */
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
        '5px': '5px',
        '8px': '8px',
        '10px': '10px',
        '12px': '12px',
        '14px': '14px',
        '15px': '15px',
        '16px': '16px',
        '17px': '17px',
        '18px': '18px',
        '19px': '19px',
        '20px': '20px',
        '21px': '21px',
        '22px': '22px',
        '23px': '23px',
        '24px': '24px',
        '25px': '25px',
        '26px': '26px',
        '27px': '27px',
        '28px': '28px',
        '30px': '30px',
        '32px': '32px',
        '33px': '33px',
        '34px': '34px',
        '35px': '35px',
        '36px': '36px',
        '37px': '37px',
        '38px': '38px',
        '39px': '39px',
        '40px': '40px',
        '42px': '42px',
        '44px': '44px',
        '45px': '45px',
        '46px': '46px',
        '47px': '47px',
        '48px': '48px',
        '50px': '50px',
        '52px': '52px',
        '53px': '53px',
        '54px': '54px',
        '55px': '55px',
        '56px': '56px',
        '57px': '57px',
        '58px': '58px',
        '59px': '59px',
        '60px': '60px',
        '61px': '61px',
        '62px': '62px',
        '63px': '63px',
        '64px': '64px',
        '65px': '65px',
        '69px': '69px',
        '70px': '70px',
        '71px': '71px',
        '72px': '72px',
        '73px': '73px',
        '74px': '74px',
        '75px': '75px',
        '76px': '76px',
        '77px': '77px',
        '80px': '80px',
        '81px': '81px',
        '82px': '82px',
        '83px': '83px',
        '85px': '85px',
        '88px': '88px',
        '90px': '90px',
        '95px': '95px',
        '98px': '98px',
        '100px': '100px',
        '110px': '110px',
        '120px': '120px',
        '122px': '122px',
        '125px': '125px',
        '128px': '128px',
        '130px': '130px',
        '136px': '136px',
        '140px': '140px',
        '150px': '150px',
        '156px': '156px',
        '160px': '160px',
        '170px': '170px',
        '180px': '180px',
        '190px': '190px',
        '200px': '200px',
        '220px': '220px',
        '240px': '240px',
        '250px': '250px',
        '254px': '254px',
        '255px': '255px',
        '256px': '256px',
        '260px': '260px',
        '271px': '271px',
        '278px': '278px',
        '280px': '280px',
        '285px': '285px',
        '290px': '290px',
        '296px': '296px',
        '300px': '300px',
        '310px': '310px',
        '320px': '320px',
        '330px': '330px',
        '340px': '340px',
        '350px': '350px',
        '354px': '354px',
        '360px': '360px',
        '370px': '370px',
        '372px': '372px',
        '400px': '400px',
        '410px': '410px',
        '420px': '420px',
        '430px': '430px',
        '438px': '438px',
        '440px': '440px',
        '450px': '450px',
        '475px': '475px',
        '479px': '479px',
        '480px': '480px',
        '500px': '500px',
        '505px': '505px',
        '510px': '510px',
        '520px': '520px',
        '530px': '530px',
        '540px': '540px',
        '549px': '549px',
        '550px': '550px',
        '555px': '555px',
        '560px': '560px',
        '565px': '565px',
        '570px': '570px',
        '580px': '580px',
        '590px': '590px',
        '600px': '600px',
        '620px': '620px',
        '630px': '630px',
        '640px': '640px',
        '650px': '650px',
        '660px': '660px',
        '680px': '680px',
        '700px': '700px',
        '726px': '726px',
        '800px': '800px',
        '950px': '950px',
        '1000px': '1000px',
        '1050px': '1050px',
        '1200px': '1200px',
        '1500px': '1500px',
        '2000px': '2000px',
        '2rem': '2rem',
        '3rem': '3rem',
        '4rem': '4rem',
        '5rem': '5rem',
        '6rem': '6rem',
        '7rem': '7rem',
        '8rem': '8rem',
        '9rem': '9rem',
        '11rem': '11rem',
        '13rem': '13rem',
        '15rem': '15rem',
        '20rem': '20rem',

        '0.5': '50%',
        '1/2': '50%',
        '1/4': '25%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/8': '12.5%',
        '3/8': '37.5%',
        '5/8': '62.5%',
        '7/8': '87.5%',
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
        '10/10': '100%',
        '1/11': '9.09090909090909%',
        '2/11': '18.181818181818183%',
        '10/11': '90.909%',
        '1/3': '33.333333%',
        '3/5': '60%',
        '95%': '95%',

        '80vh': '80vh',
        '95vh': '95vh',
        '120vh': '120vh',

        '70vw': '70vw',
        '80vw': '80vw',
        '85vw': '85vw',
        '90vw': '90vw',

        // Info: (20230801- Julian) A4 尺寸
        'a4-width': '595px',
        'a4-height': '842px',
      },
      margin: {
        '8px': '8px',
        '10px': '10px',
        '55px': '55px',
        '83px': '83px',
        '88px': '88px',
        '130px': '130px',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/5': '20%',
        '1/6': '16.666667%',
        '1/8': '12.5%',
        '1/10': '10%',
        '1/12': '8.333333%',
        '1/20': '5%',
        '1/25': '4%',
        '1/50': '2%',
      },
      padding: {
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/5': '20%',
        '1/6': '16.666667%',
        '1/8': '12.5%',
        '1/10': '10%',
        '1/12': '8.333333%',
        '1/20': '5%',
        '1/25': '4%',
        '1/50': '2%',
        '50px': '50px',
      },
      translate: {
        85: '85%',
      },
      boxShadow: {
        lg: '0 4px 10px rgba(0,0,0,0.7)',
        xl: '0 4px 24px rgba(0, 0, 0, 0.40)',
        xlReverse: '0px -4px 24px rgba(0, 0, 0, 0.40)',
        xlSide: '4px 0px 24px rgba(0, 0, 0, 0.40)',
        purple: '0px 0px 6px 0px #AB50FF',
        violet:
          '0px 0px 12px 0px rgba(175, 80, 255, 0.30), 0px 0px 24px 0px rgba(175, 80, 255, 0.30) inset',
        inner3xl: 'inset 0 4px 24px 0 rgba(0, 0, 0, 0.8)',
      },
      dropShadow: {
        lg: '0 4px 10px rgba(0,0,0,0.7)',
        xl: '0px 4px 24px rgba(0, 0, 0, 0.40)',
        xlReverse: '0px -4px 24px rgba(0, 0, 0, 0.40)',
        xlSide: '4px 0px 24px rgba(0, 0, 0, 0.40)',
        purple: '0 2px 10px #AB50FF',
        101: '0px 4px 70px rgba(0, 0, 0, 0.40)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif', 'ui-sans-serif', 'system-ui'],
        roboto: ['Roboto', 'sans-serif', 'ui-sans-serif', 'system-ui'],
      },
      maxWidth: {
        '80px': '80px',
        '140px': '140px',
        '225px': '225px',
        '250px': '250px',
        '300px': '300px',
        '550px': '550px',
      },
      minWidth: {
        '200px': '200px',
      },
      maxHeight: {
        '200px': '200px',
        '300px': '300px',
      },
      minHeight: {
        'fit': 'fit-content',
        '55px': '55px',
        '200px': '200px',
        '320px': '320px',
        '350px': '350px',
        '680px': '680px',
      },
      zIndex: {
        60: 60,
        70: 70,
        80: 80,
      },
      gridTemplateRows: {
        0: 'repeat(1, minmax(0px, 0fr))',
      },
      transitionProperty: {
        grid: 'grid-template-rows',
      },
      rotate: {
        '135': '135deg',
      },
      borderWidth: {
        '3px': '3px',
        '5px': '5px',
      },
      backgroundSize: {
        '150': '150%',
      },
      backgroundPosition: {
        'top-4': 'center top -2.5rem',
      },
      // animation class
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-fast': 'spin 1s linear infinite',
        fadeOut: 'fadeOut 3s ease-in-out',
        wiggle: 'wiggle 1s ease-in-out infinite',
        slightWiggle: 'slightWiggle 1s ease-in-out infinite',
        heartBeat: 'heartBeat 1s infinite',
        hflip: 'flipHorizontal 2s infinite',
        vflip: 'flipVertical 2s infinite',
        swing: 'swing 2s ease-out infinite',
        rubberBand: 'rubberBand 1s infinite',
        // flash: 'flash 2s infinite',
        flash: 'flash 1s infinite',
        headShake: 'headShake 2s infinite',
        wobble: 'wobble 1s infinite',
        jello: 'jello 2s infinite',
        openMenu: 'open-menu 0.5s ease-in-out forwards',
        loading: 'loading 1.5s infinite',
      },
      // actual animation
      keyframes: theme => ({
        fadeOut: {
          '100%': {opacity: 0},
          '0%': {opacity: 1},
        },
        slightBounce: {
          '0%, 100%': {transform: 'translateY(0)'},
          '50%': {transform: 'translateY(-10px)'},
        },
        slightWiggle: {
          '0%, 100%': {transform: 'rotate(-1deg)'},
          '50%': {transform: 'rotate(1deg)'},
        },
        wiggle: {
          '0%, 100%': {transform: 'rotate(-3deg)'},
          '50%': {transform: 'rotate(3deg)'},
        },
        heartBeat: {
          '0%': {transform: 'scale(1);'},
          '14%': {transform: 'scale(1.3);'},
          '28%': {transform: 'scale(1);'},
          '42%': {transform: 'scale(1.3);'},
          '70%': {transform: 'scale(1);'},
        },
        flipHorizontal: {
          '50%': {transform: 'rotateY(180deg)'},
        },
        flipVertical: {
          '50%': {transform: 'rotateX(180deg)'},
        },
        swing: {
          '20%': {
            transform: 'rotate3d(0, 0, 1, 15deg)',
          },

          '40%': {
            transform: 'rotate3d(0, 0, 1, -10deg)',
          },

          '60%': {
            transform: 'rotate3d(0, 0, 1, 5deg)',
          },

          '80%': {
            transform: 'rotate3d(0, 0, 1, -5deg)',
          },
          to: {
            transform: 'rotate3d(0, 0, 1, 0deg)',
          },
        },
        rubberBand: {
          from: {
            transform: 'scale3d(1, 1, 1)',
          },

          '30%': {
            transform: 'scale3d(1.25, 0.75, 1)',
          },

          '40%': {
            transform: 'scale3d(0.75, 1.25, 1)',
          },

          '50%': {
            transform: 'scale3d(1.15, 0.85, 1)',
          },

          '65%': {
            transform: 'scale3d(0.95, 1.05, 1)',
          },

          '75%': {
            transform: 'scale3d(1.05, 0.95, 1)',
          },
          to: {
            transform: 'scale3d(1, 1, 1)',
          },
        },
        flash: {
          '25%, 40%': {opacity: '0'},
          // '50%': {opacity: '1'},
          // '75%': {opacity: '0'},
          '75%': {opacity: '1'},
        },
        headShake: {
          '0%': {
            transform: 'translateX(0)',
          },
          '6.5%': {
            transform: 'translateX(-6px) rotateY(-9deg)',
          },

          '18.5%': {
            transform: 'translateX(5px) rotateY(7deg)',
          },

          '31.5%': {
            transform: 'translateX(-3px) rotateY(-5deg)',
          },

          '43.5%': {
            transform: 'translateX(2px) rotateY(3deg)',
          },
          '50%': {
            transform: 'translateX(0)',
          },
        },
        wobble: {
          from: {
            transform: 'translate3d(0, 0, 0)',
          },

          '15%': {
            transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)',
          },

          '30%': {
            transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)',
          },

          '45%': {
            transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)',
          },

          '60%': {
            transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)',
          },

          '75%': {
            transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)',
          },

          to: {
            transform: 'translate3d(0, 0, 0)',
          },
        },
        jello: {
          'from, 11.1%,to': {
            transform: 'translate3d(0, 0, 0)',
          },

          '22.2%': {
            transform: 'skewX(-12.5deg) skewY(-12.5deg)',
          },

          '33.3%': {
            transform: 'skewX(6.25deg) skewY(6.25deg)',
          },

          '44.4%': {
            transform: 'skewX(-3.125deg) skewY(-3.125deg)',
          },

          '55.5%': {
            transform: 'skewX(1.5625deg) skewY(1.5625deg)',
          },

          '66.6%': {
            transform: 'skewX(-0.78125deg) skewY(-0.78125deg)',
          },

          '77.7%': {
            transform: 'skewX(0.390625deg) skewY(0.390625deg)',
          },

          '88.8%': {
            transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)',
          },
        },
        openMenu: {
          '0%, 20%': {transform: 'rotate(-3deg)'},
        },
        loading: {
          '0%': {transform: 'translateX(-80%)'},
          '100%': {transform: 'translateX(120%)'},
        },
      }),
    },
  },
  plugins: [],
};
