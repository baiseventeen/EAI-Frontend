import {Swiper, SwiperSlide, SwiperClass} from "swiper/react";
import ArrowLeft from "../../../../image/ArrowLeft.png";
import ArrowRight from "../../../../image/ArrowRight.png"
import "./index.scss"
import {useRef} from "react";

export function Banner() {
    const current = useRef<SwiperClass>()


    function onClickPre() {
        current.current.slidePrev()
    }

    function onClickNext() {
        current.current.slideNext()
    }

    return <div className="swiper-banner">
        <Swiper
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper: SwiperClass) => current.current = swiper}
            loop
            autoplay
        >
            <div className="arrow left">
                <img src={ArrowLeft} className="arrow-image" alt="" onClick={onClickPre}/>
            </div>
            <div className="arrow top">
                <img src={ArrowRight} className="arrow-image" alt="" onClick={onClickNext}/>
            </div>
            <SwiperSlide className="slide-items">
                <img
                    src="https://cdn.pixabay.com/photo/2024/03/04/16/44/barberry-8612696_960_720.jpg"
                    alt=""
                    className="slider-image"
                />
            </SwiperSlide>
            <SwiperSlide className="slide-items">
                <img
                    src="https://cdn.pixabay.com/photo/2023/11/24/17/22/pigeon-8410348_1280.jpg"
                    alt=""
                    className="slider-image"
                />
            </SwiperSlide>
            <SwiperSlide className="slide-items">
                <img
                    src="https://cdn.pixabay.com/photo/2024/01/29/13/00/rabbit-8539830_960_720.jpg"
                    alt=""
                    className="slider-image"
                />
            </SwiperSlide>
            <SwiperSlide className="slide-items">
                <img
                    src="https://cdn.pixabay.com/photo/2024/02/05/10/48/red-kite-8554201_960_720.jpg"
                    alt=""
                    className="slider-image"
                />
            </SwiperSlide>
        </Swiper>
    </div>
}