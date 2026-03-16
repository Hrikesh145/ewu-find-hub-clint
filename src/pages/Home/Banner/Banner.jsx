import React, { useRef } from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Banner.css';

const SLIDES = [
  {
    id: 1,
    tag: 'EWU Official Platform',
    headline: ['Lost on campus?', "We'll reunite it."],
    sub: 'Report your lost item. Our center holds found items safely. Search, claim, and collect — all verified by the EWU admin team.',
    cta:      { label: 'Report an item →', to: '/addItems' },
    ctaGhost: { label: 'Search items',     to: '/allItems' },
    theme: 'slide--navy',
    visual: 'stats',
  },
  {
    id: 2,
    tag: 'Success stories',
    headline: ['183 items returned', 'this semester.'],
    sub: 'EWU students are reuniting with their belongings every single day. A trusted, admin-verified system that actually works.',
    cta:      { label: 'See recovered items →', to: '/allItems' },
    ctaGhost: { label: 'How it works',          to: '/#how'     },
    theme: 'slide--teal',
    visual: 'items',
  },
  {
    id: 3,
    tag: 'Found something?',
    headline: ['Be the reason', 'someone smiles.'],
    sub: 'Found something on campus? Post it and drop it at the EWU center. Three simple steps — someone is waiting for it.',
    cta:      { label: 'Submit found item →', to: '/addItems' },
    ctaGhost: { label: 'Learn more',          to: '/#how'     },
    theme: 'slide--deep',
    visual: 'steps',
  },
];

const StatsVisual = () => (
  <div className="bn-visual bn-visual--stats">
    {[
      { ico: '📦', n: '248', l: 'Items posted',  cls: 'blue'  },
      { ico: '✅', n: '183', l: 'Returned',       cls: 'green' },
      { ico: '🏛️', n: '31',  l: 'At center now', cls: 'amber' },
    ].map(({ ico, n, l, cls }) => (
      <div key={l} className="bn-scard">
        <div className={`bn-scard__ico bn-scard__ico--${cls}`}>{ico}</div>
        <div>
          <div className="bn-scard__n">{n}</div>
          <div className="bn-scard__l">{l}</div>
        </div>
      </div>
    ))}
  </div>
);

const ItemsVisual = () => (
  <div className="bn-visual bn-visual--items">
    {[
      { name: 'Student ID card',  loc: 'Cafeteria · Ground floor' },
      { name: 'Wireless earbuds', loc: 'Room 412 · Block C'       },
      { name: 'Black backpack',   loc: 'Parking lot · Block B'    },
    ].map(({ name, loc }) => (
      <div key={name} className="bn-icard">
        <div>
          <div className="bn-icard__name">{name}</div>
          <div className="bn-icard__loc">{loc}</div>
        </div>
        <div className="bn-icard__badge">Returned ✓</div>
      </div>
    ))}
  </div>
);

const StepsVisual = () => (
  <div className="bn-visual bn-visual--steps">
    {[
      { n: '1', t: 'Post the item',    d: 'Describe & add location'       },
      { n: '2', t: 'Submit to center', d: 'Drop at EWU Lost & Found desk' },
      { n: '3', t: 'Owner collects',   d: 'Admin verifies & hands over'   },
    ].map(({ n, t, d }) => (
      <div key={n} className="bn-step">
        <div className="bn-step__n">{n}</div>
        <div>
          <div className="bn-step__t">{t}</div>
          <div className="bn-step__d">{d}</div>
        </div>
      </div>
    ))}
  </div>
);

const VISUALS = { stats: StatsVisual, items: ItemsVisual, steps: StepsVisual };

const Banner = () => {
  const progressRef = useRef(null);
  const paginationRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const onAutoplayTimeLeft = (_s, _time, progress) => {
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${1 - progress})`;
    }
  };

  return (
    <section className="bn-wrap">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          el: paginationRef.current,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.params.pagination.el     = paginationRef.current;
        }}
        loop={true}
        speed={800}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="bn-swiper"
      >
        {SLIDES.map(({ id, tag, headline, sub, cta, ctaGhost, theme, visual }) => {
          const Visual = VISUALS[visual];
          return (
            <SwiperSlide key={id} className={`bn-slide ${theme}`}>
              <div className="bn-blob bn-blob--tr" />
              <div className="bn-blob bn-blob--bl" />
              <div className="bn-slide__inner">
                <div className="bn-content">
                  <div className="bn-tag">
                    <span className="bn-tag__dot" />
                    <span className="bn-tag__txt">{tag}</span>
                  </div>
                  <h1 className="bn-h1">
                    {headline[0]}
                    <em>{headline[1]}</em>
                  </h1>
                  <p className="bn-p">{sub}</p>
                  <div className="bn-btns">
                    <Link to={cta.to}      className="bn-btn bn-btn--white">{cta.label}</Link>
                    <Link to={ctaGhost.to} className="bn-btn bn-btn--ghost">{ctaGhost.label}</Link>
                  </div>
                </div>
                <div className="bn-visual-wrap">
                  <Visual />
                </div>
              </div>
            </SwiperSlide>
          );
        })}

        {/* Controls — rendered inside Swiper so refs are stable */}
        <div className="bn-controls">
          <button ref={prevRef} className="bn-arr bn-arr--prev" aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div ref={paginationRef} className="bn-dots" />

          <button ref={nextRef} className="bn-arr bn-arr--next" aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="bn-progress">
          <div className="bn-progress__bar" ref={progressRef} />
        </div>
      </Swiper>
    </section>
  );
};

export default Banner;