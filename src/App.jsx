import { useEffect, useRef } from 'react'
import content from './data/content.json'

const { business, hero, strip, collection, promBand, departments, runway, pullQuote, instagram, visit } = content

function Monogram({ className }) {
  return (
    <svg className={className} viewBox="0 0 132 76" aria-hidden="true">
      <g fill="none" stroke="#C8A24A" strokeWidth="4.4">
        <circle cx="46" cy="38" r="30" />
        <circle cx="86" cy="38" r="30" />
        <path d="M46 8 A30 30 0 0 1 74.7 29.2" strokeWidth="4.6" />
      </g>
    </svg>
  )
}

function InstaMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none" />
    </svg>
  )
}

function App() {
  const trackRef = useRef(null)

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((e) => e.classList.add('in'))
      return
    }
    els.forEach((e, i) => setTimeout(() => e.classList.add('in'), 110 * i + 80))
  }, [])

  useEffect(() => {
    // Duplicate the runway cards so the marquee scroll loops seamlessly (-50%).
    const track = trackRef.current
    if (track && !track.dataset.duplicated) {
      track.innerHTML += track.innerHTML
      track.dataset.duplicated = 'true'
    }
  }, [])

  const mapQuery = encodeURIComponent(`${business.street}, ${business.cityStateZip}`)

  return (
    <>
      <div className="ribbon">
        <b>{business.years} Years</b>&nbsp; of Fashion, Family and Fabulous You
      </div>

      <header className="head">
        <div className="head-in">
          <nav aria-label="Primary">
            <a href="#collection">Collection</a>
            <a href="#prom">Prom</a>
            <a href="#visit">Visit</a>
          </nav>
          <a className="brand" href="#top" aria-label={`${business.name} home`}>
            <span className="mono" aria-hidden="true"><Monogram /></span>
            <span className="wb">
              <span className="the">The</span>
              <span className="nm serif">
                <span className="sr">Showroom</span> <span className="bo">Boutique</span>
              </span>
            </span>
          </a>
          <a className="tel" href={business.phoneHref}>
            <span className="lab">Call the store</span>
            {business.phone}
          </a>
        </div>
      </header>

      {/* ===== SPLIT EDITORIAL HERO ===== */}
      <section className="hero" id="top">
        <div className="hero-panel">
          <p className="eyebrow reveal">{hero.eyebrow}</p>
          <h1 className="reveal">
            {hero.headline}
            <br />
            <span className="sr">{hero.headlineAccent}</span>
          </h1>
          <p className="reveal">{hero.body}</p>
          <div className="cta reveal">
            <a className="btn btn-solid" href="#visit">{hero.ctaPrimary}</a>
            <a className="btn btn-ghost" href={business.phoneHref}>Call {business.phone}</a>
          </div>
        </div>
        <div className="hero-figure">
          <img src={hero.image} alt={hero.imageAlt} />
        </div>
      </section>

      <div className="strip">
        <div className="row">
          {strip.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </div>

      {/* ===== COLLECTION ===== */}
      <section id="collection" className="wrap">
        <div className="sec-head">
          <div>
            <span className="kicker k">{collection.kicker}</span>
            <h2>{collection.heading}</h2>
          </div>
          <a className="lnk" href="#visit">See them in store</a>
        </div>
        <div className="collection">
          {collection.pieces.map((piece, i) => (
            <article className="piece" key={piece.name}>
              <span className="no">{String(i + 1).padStart(2, '0')}</span>
              <div className="ph">
                <img src={piece.image} alt={piece.alt} style={piece.cutout ? { mixBlendMode: 'darken' } : undefined} />
              </div>
              <div className="cap">
                <span className="nm serif">{piece.name}</span>
                <span className="tag">{piece.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== PROM BAND ===== */}
      <section className="band" id="prom" style={{ padding: 0 }}>
        <div className="band-grid">
          <div className="art">
            <img src={promBand.image} alt={promBand.alt} />
            <div className="tint"></div>
          </div>
          <div className="txt">
            <span className="kicker k">{promBand.kicker}</span>
            <h2>{promBand.heading}</h2>
            <p>{promBand.body}</p>
            <a className="btn btn-ghost" href="#visit" style={{ alignSelf: 'flex-start' }}>{promBand.cta}</a>
          </div>
        </div>
      </section>

      {/* ===== DEPARTMENTS ===== */}
      <section className="wrap">
        <div className="sec-head">
          <div>
            <span className="kicker k">{departments.kicker}</span>
            <h2>{departments.heading}</h2>
          </div>
        </div>
        <div className="depts">
          {departments.items.map((dept) => (
            <a className="dept" href="#collection" key={dept.title}>
              <div className="ph">
                <img src={dept.image} alt={dept.alt} style={{ objectPosition: dept.focus }} />
              </div>
              <div className="veil"></div>
              <div className="lab">
                <span className="t serif">{dept.title}</span>
                <span className="go">{dept.subtitle}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ===== RUNWAY (moving carousel) ===== */}
      <section className="runway" id="runway" aria-label="Looks in motion">
        <div className="rhead">
          <span className="kicker k">{runway.kicker}</span>
          <h2>{runway.heading}</h2>
          <p>
            {runway.body.replace('Instagram.', '')}
            <a href={business.instagramUrl} rel="noopener">Instagram</a>.
          </p>
        </div>
        <div className="viewport">
          <div className="track" ref={trackRef}>
            {runway.cards.map((card, i) =>
              card.type === 'video' ? (
                <a
                  className="card movie"
                  href={business.instagramUrl}
                  rel="noopener"
                  aria-label={`Watch the ${card.caption} reel on Instagram`}
                  key={i}
                >
                  <span className="tagv">Reel</span>
                  <video autoPlay muted loop playsInline preload="metadata" poster={card.poster}>
                    <source src={card.video} type="video/mp4" />
                  </video>
                  <span className="cc">{card.caption}</span>
                </a>
              ) : (
                <a className="card" href={business.instagramUrl} rel="noopener" aria-label="View on Instagram" key={i}>
                  <img src={card.image} alt={card.alt} />
                  <span className="cc">{card.caption}</span>
                </a>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ===== PULL QUOTE ===== */}
      <section className="pull">
        <div className="divider" aria-hidden="true">
          <span className="mono"><Monogram /></span>
        </div>
        <span className="kicker k">{pullQuote.kicker}</span>
        <p className="serif">{pullQuote.quote}</p>
      </section>

      {/* ===== INSTAGRAM ===== */}
      <section className="insta wrap" id="insta">
        <div className="head-row">
          <div>
            <span className="kicker k">{instagram.kicker}</span>
            <h2><a href={business.instagramUrl} rel="noopener">{business.instagramHandle}</a></h2>
            <p className="followers">{instagram.blurb}</p>
          </div>
          <a className="btn btn-dark" href={business.instagramUrl} rel="noopener">{instagram.ctaLabel}</a>
        </div>
        <div className="ig-grid">
          {instagram.grid.map((cell, i) => (
            <a className="ig-cell" href={business.instagramUrl} rel="noopener" aria-label={`View ${business.name} on Instagram`} key={i}>
              <img src={cell.image} alt={cell.alt} />
              <span className="mk"><InstaMark /></span>
            </a>
          ))}
        </div>
      </section>

      {/* ===== VISIT + MAP ===== */}
      <section className="visit" id="visit">
        <div className="wrap grid">
          <div>
            <span className="kicker k" id="accessories">{visit.kicker}</span>
            <h2>{visit.heading}</h2>
            <p className="addr">
              {business.street}
              <br />
              {business.cityStateZip}
            </p>
            <a className="tel2" href={business.phoneHref}>{business.phone}</a>
            <div className="links">
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name)}+${mapQuery}`}>Get Directions</a>
              <a href={business.instagramUrl} rel="noopener">Instagram</a>
            </div>
            <div><span className="chip">{business.hoursNote}</span></div>
          </div>
          <div className="mapframe">
            <iframe
              title={`Map to ${business.name}, ${business.street}, ${business.cityStateZip}`}
              src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <footer>
        <div className="row">
          <div className="fmark">
            <span className="mono" aria-hidden="true"><Monogram /></span>
            <span className="nm">{business.name}</span>
          </div>
          <div>
            {business.street}, {business.cityStateZip} &middot; <a href={business.phoneHref}>{business.phone}</a> &middot;{' '}
            <a href={business.instagramUrl} rel="noopener">{business.instagramHandle}</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
