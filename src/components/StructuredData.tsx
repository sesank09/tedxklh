export default function StructuredData() {
  const baseUrl = "https://tedxklhbowrampet.in";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TEDxKLH",
    "alternateName": [
      "TEDx KLH",
      "tedxklh",
      "TEDxKLH 2026",
      "TEDxKLH Bowrampet",
      "TEDx KL University",
      "TEDx Hyderabad"
    ],
    "url": baseUrl,
    "description": "Official TEDxKLH website. An independently organized TED event under official license from TED, hosted at KLH University, Bowrampet Campus, Hyderabad.",
    "publisher": {
      "@type": "Organization",
      "name": "TEDxKLH",
      "logo": `${baseUrl}/icon-512.png`
    }
  };

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "TEDxKLH 2026: METAMORPHOSIS — The Unseen Process of Becoming",
    "alternateName": [
      "TEDxKLH",
      "TEDx KLH",
      "tedxklh",
      "TEDxKLH 2026",
      "TEDx Bowrampet 2026",
      "TEDx Hyderabad 2026"
    ],
    "description": "Official TEDxKLH 2026 flagship conference: METAMORPHOSIS. An annual conference exploring structural transformations across cognitive computing, neuroscience, mountaineering, luxury design, social inclusion, and sustainable enterprise at KLH University, Bowrampet, Hyderabad.",
    "url": baseUrl,
    "startDate": "2026-11-04T09:00:00+05:30",
    "endDate": "2026-11-04T18:00:00+05:30",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": [
      `${baseUrl}/metamorphosis-art.jpg`,
      `${baseUrl}/butterfly-art.jpg`,
      `${baseUrl}/icon-512.png`,
      `${baseUrl}/tedxklh-logo.png`
    ],
    "location": {
      "@type": "Place",
      "name": "KLH Auditorium & Pavilion",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "ALEAP Industrial Area, Bowrampet",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "postalCode": "500043",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 17.5623,
        "longitude": 78.3846
      },
      "hasMap": "https://www.google.com/maps/place/KLH+University,+Bowrampet/data=!4m2!3m1!1s0x0:0xc307c84e835d6187?sa=X&ved=1t:2428&ictx=111"
    },
    "offers": {
      "@type": "Offer",
      "name": "TEDxKLH Delegate Pass",
      "url": `${baseUrl}/apply`,
      "price": "499",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": "2026-10-01",
      "description": "Access to keynotes, interactive pavilion installations, breakout networking lounges, delegate kit, and curated dining."
    },
    "organizer": {
      "@type": "Organization",
      "name": "TEDxKLH",
      "alternateName": ["TEDx KLH", "tedxklh", "TEDxKLH 2026"],
      "url": baseUrl,
      "logo": `${baseUrl}/icon-512.png`,
      "sameAs": [
        "https://www.instagram.com/tedxklh",
        "https://www.linkedin.com/company/tedxklh",
        "https://twitter.com/tedxklh"
      ]
    },
    "performer": [
      {
        "@type": "Person",
        "name": "Sri Charan Lakkaraju",
        "jobTitle": "Founder & CEO",
        "worksFor": { "@type": "Organization", "name": "Student Tribe" },
        "image": `${baseUrl}/speakers/sri-charan-lakkaraju.jpg`,
        "description": "Founder & CEO of Student Tribe, youth-focused community builder empowering students across Tier 2 and Tier 3 colleges in India."
      },
      {
        "@type": "Person",
        "name": "Phani Gogireddy",
        "jobTitle": "Founder & CEO, Filmmaker & DoP",
        "worksFor": { "@type": "Organization", "name": "24 Frames" },
        "image": `${baseUrl}/speakers/phani-gogireddy.jpg`,
        "description": "Founder of 24 Frames, official Nikon India Influencer, redefining luxury visual storytelling and cinematography."
      },
      {
        "@type": "Person",
        "name": "Dr. Vikrant Singh Thakur",
        "jobTitle": "Neurologist & Founder",
        "worksFor": { "@type": "Organization", "name": "TIME Neurocare" },
        "image": `${baseUrl}/speakers/dr-vikrant-singh-thakur.jpg`,
        "description": "Neurologist dedicated to bringing advanced neurological care and patient well-being to communities beyond metropolitan cities."
      },
      {
        "@type": "Person",
        "name": "Kumar Raja",
        "jobTitle": "Founder & Creative Director",
        "worksFor": { "@type": "Organization", "name": "Design by Raja" },
        "image": `${baseUrl}/speakers/kumar-raja.jpg`,
        "description": "Renowned wedding planner and experiential designer blending elegance, innovation, and timeless grandeur into bespoke environments."
      },
      {
        "@type": "Person",
        "name": "Major General N D Prasad AVSM, VSM (Retd.)",
        "jobTitle": "Veteran Indian Army Officer & Strategic Affairs Expert",
        "worksFor": { "@type": "Organization", "name": "Indian Army" },
        "image": `${baseUrl}/speakers/major-general-nd-prasad.jpg`,
        "description": "Decorated Indian Army veteran, former Dean at Army War College, and strategic affairs expert on national security and defence strategy."
      },
      {
        "@type": "Person",
        "name": "Moses Chowdari",
        "jobTitle": "Trustee & Chief Operating Officer",
        "worksFor": { "@type": "Organization", "name": "EnAble India" },
        "image": `${baseUrl}/speakers/moses-chowdari.jpg`,
        "description": "Disability inclusion champion, Helen Keller Award recipient, and mission leader advancing employment opportunities for persons with disabilities."
      },
      {
        "@type": "Person",
        "name": "Poorna Malavath",
        "jobTitle": "Mountaineer & Seven Summits Achiever",
        "worksFor": { "@type": "Organization", "name": "Guinness World Record Holder" },
        "image": `${baseUrl}/speakers/poorna-malavath.jpg`,
        "description": "Youngest girl in the world to summit Mount Everest at age 13, Seven Summits conqueror, and Forbes India Self-Made Woman."
      },
      {
        "@type": "Person",
        "name": "Srikanth Acharya",
        "jobTitle": "Founder & CEO",
        "worksFor": { "@type": "Organization", "name": "OffiNeeds" },
        "image": `${baseUrl}/speakers/srikanth-acharya.jpg`,
        "description": "Entrepreneur transforming corporate gifting into purpose-driven tools for employee appreciation and enduring brand relationships."
      },
      {
        "@type": "Person",
        "name": "Tamal Chatterjee",
        "jobTitle": "Chief Growth Officer",
        "worksFor": { "@type": "Organization", "name": "Sid's Farm" },
        "image": `${baseUrl}/speakers/tamal-chatterjee.jpg`,
        "description": "Seasoned business leader with 23+ years of experience across consumer durables, e-commerce, and dairy, driving growth and brand strategy."
      }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "TEDxKLH",
    "legalName": "TEDxKLH Bowrampet Campus",
    "alternateName": ["TEDx KLH", "tedxklh", "TEDxKLH 2026", "TEDxKLH Hyderabad"],
    "url": baseUrl,
    "logo": `${baseUrl}/icon-512.png`,
    "image": `${baseUrl}/icon-512.png`,
    "description": "TEDxKLH is an independently organized TED event hosted at KLH University, Bowrampet Campus, Hyderabad under official license from TED.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ALEAP Industrial Area, Bowrampet",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500043",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "organizer desk",
      "email": "tedxklhbowrampet@klh.edu.in",
      "availableLanguage": ["English", "Hindi", "Telugu"]
    },
    "sameAs": [
      "https://www.instagram.com/tedxklh",
      "https://www.linkedin.com/company/tedxklh",
      "https://twitter.com/tedxklh",
      "https://www.ted.com/tedx/events"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": "KLH University Bowrampet Campus — TEDx Venue",
    "url": baseUrl,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.5623,
      "longitude": 78.3846
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ALEAP Industrial Area, Bowrampet",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500043",
      "addressCountry": "IN"
    },
    "hasMap": "https://www.google.com/maps/place/KLH+University,+Bowrampet/data=!4m2!3m1!1s0x0:0xc307c84e835d6187?sa=X&ved=1t:2428&ictx=111"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is TEDxKLH 2026: METAMORPHOSIS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TEDxKLH is a local, independently organized event operated under official license from TED. Our 2026 theme, METAMORPHOSIS: The Unseen Process of Becoming, explores structural transformations across cognitive computing, synthetic biology, planetary engineering, human consciousness, and design."
        }
      },
      {
        "@type": "Question",
        "name": "When and where is the TEDxKLH 2026 conference taking place?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The conference takes place on NOVEMBER 4, 2026 as an all-day immersive experience at the KLH Auditorium & Pavilion, Bowrampet Campus, Hyderabad (Coordinates: 17.5623° N, 78.3846° E). Selected delegates gain full access to keynotes, interactive pavilion installations, breakout networking lounges, and curated dining."
        }
      },
      {
        "@type": "Question",
        "name": "How does the delegate curation and pass allocation work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To ensure intimacy, intellectual depth, and high-value networking, TEDxKLH admits a cohort of 250 curated delegates. Applications are evaluated on candidate background, perspective, and alignment with the spirit of ideas worth spreading."
        }
      },
      {
        "@type": "Question",
        "name": "What is the fee and payment verification process for TEDxKLH passes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Once you submit your application and transfer the registration pass fee via UPI or Bank transfer, you submit your 12-digit UTR transaction reference and payment screenshot. Our finance desk verifies your payment within 24 hours and issues your encrypted digital entry pass."
        }
      },
      {
        "@type": "Question",
        "name": "Will the TEDxKLH talks be recorded and published globally?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, every talk is filmed in 4K multi-angle cinema resolution and published to the official TEDx global YouTube channel (39M+ subscribers) and the official TED platform post-conference."
        }
      },
      {
        "@type": "Question",
        "name": "Are there opportunities for corporate partnerships or speaker nominations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We welcome forward-thinking organizations, labs, and research collectives to partner with us. You can submit partnership inquiries or speaker nominations via our official desk at tedxklhbowrampet@klh.edu.in."
        }
      }
    ]
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Speakers",
        "item": `${baseUrl}/#speakers`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Venue & Coordinates",
        "item": `${baseUrl}/#venue`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Apply for Delegate Pass",
        "item": `${baseUrl}/apply`
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Check Application Status",
        "item": `${baseUrl}/application-status`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
    </>
  );
}
