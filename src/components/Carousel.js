import { useEffect } from 'react';
import Swiper, { Navigation, Pagination } from 'swiper';
import 'swiper/swiper-bundle.css';
import SwiperProductCard from './SwiperProductCard';
import { Global, css } from '@emotion/react';
import { Card } from '@chakra-ui/react';

Swiper.use([Navigation, Pagination]);

function SwiperComponent() {
  useEffect(() => {
    const swiper = new Swiper('.swiper-container', {
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
      },
      slidesPerView: 3,
      centeredSlides: true,
      spaceBetween: 200,
      on: {
        slideChangeTransitionEnd: () => {
          console.log('Slide changed');
          const activeSlide = document.querySelector('.swiper-slide-active');
          const previousSlide = document.querySelector('.swiper-slide-prev');
          const nextSlide = document.querySelector('.swiper-slide-next');
          const allSlides = document.querySelectorAll('.swiper-slide');
        
          if (activeSlide) {
            activeSlide.classList.add('swiper-slide-centered');
          }
          if (previousSlide) {
            previousSlide.classList.add('swiper-slide-prev-centered');
          }
          if (nextSlide) {
            nextSlide.classList.add('swiper-slide-next-centered');
          }
        
          allSlides.forEach((slide) => {
            if (slide !== activeSlide && slide !== previousSlide && slide !== nextSlide) {
              slide.classList.remove('swiper-slide-centered', 'swiper-slide-prev-centered', 'swiper-slide-next-centered');
            }
          });
        },
      }      
    });

    return () => {
      swiper.destroy();
    };
  }, []);

  return (
    <>
    <Global
      styles={css`
      .swiper-slide-prev-centered {
        background-color: white !important;
        transform: scale(0.8) translateX(-110px);
      }
      
      .swiper-slide-next-centered {
        background-color: white !important;
        transform: scale(0.8) translateX(110px);
      }
      
      .swiper-slide-centered {
        background-color: gray !important;
        transform: scale(1.5) !important;
      }   
      `}
    />
    <div className="swiper-container">
      <div className="swiper-wrapper">
        <Card size="md" className="swiper-slide">Slide 1</Card>
        <div className="swiper-slide">Slide 2</div>
        <div className="swiper-slide">Slide 3</div>
        <div className="swiper-slide">Slide 4</div>
        <div className="swiper-slide">Slide 5</div>
        <div className="swiper-slide">Slide 6</div>
      </div>
      <div className="swiper-pagination"></div>
      <div className="swiper-button-prev"></div>
      <div className="swiper-button-next"></div>
    </div>
    </>
  );
}

export default SwiperComponent;