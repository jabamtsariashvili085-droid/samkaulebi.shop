"use client"

import { useEffect, useRef, useState } from "react"

const testimonials = [
  {
    id: 1,
    name: "მარიამ გ.",
    location: "თბილისი",
    rating: 5,
    text: "ბეჭედი უბრალოდ მშვენიერია! ხარისხი ზუსტად ისეთია როგორც აღწერაშია. აუცილებლად დავბრუნდები.",
    product: "ოქროს ბეჭედი"
  },
  {
    id: 2,
    name: "ნინო ქ.",
    location: "ბათუმი",
    rating: 5,
    text: "სუნამო ზუსტად ისეთია როგორც ვეძებდი. სწრაფი მიწოდება და შესანიშნავი მომსახურება.",
    product: "Floral Dream"
  },
  {
    id: 3,
    name: "თამარ ჯ.",
    location: "ქუთაისი",
    rating: 5,
    text: "არგანის ზეთმა თმა სრულიად გადამისხვავა. ძალიან კმაყოფილი ვარ შედეგით.",
    product: "არგანის ზეთი"
  },
  {
    id: 4,
    name: "გიორგი ბ.",
    location: "თბილისი",
    rating: 5,
    text: "საჩუქრად ვიყიდე ცოლისთვის და აღფრთოვანებულია. შეფუთვაც ძალიან ლამაზი იყო.",
    product: "მარგალიტის ყელსაბამი"
  },
  {
    id: 5,
    name: "ანა ლ.",
    location: "რუსთავი",
    rating: 5,
    text: "მეორედ ვყიდულობ აქ და ყოველთვის კმაყოფილი ვარ. ფასი და ხარისხი იდეალურად თანხვდება.",
    product: "აღმდგენი შამპუნი"
  },
  {
    id: 6,
    name: "ლუკა წ.",
    location: "თელავი",
    rating: 5,
    text: "Ocean Breeze ჩემი საყვარელი სუნამო გახდა. ხანგრძლივი არომატი და მშვენიერი ფლაკონი.",
    product: "Ocean Breeze"
  },
  {
    id: 7,
    name: "სოფო მ.",
    location: "ზუგდიდი",
    rating: 5,
    text: "საყურეები ზუსტად ისეთია როგორც სურათზე. მაღალი ხარისხი და ელეგანტური დიზაინი.",
    product: "ბრილიანტის საყურეები"
  },
  {
    id: 8,
    name: "დავით მ.",
    location: "გორი",
    rating: 5,
    text: "Leather & Wood - საუკეთესო არჩევანი კაცისთვის. მდიდარი, მასკულინური არომატი.",
    product: "Leather & Wood"
  },
  {
    id: 9,
    name: "ელენე კ.",
    location: "თბილისი",
    rating: 5,
    text: "ყავის სკრაბი უბრალოდ სასწაულია! კანი გლუვი და ნაზი გახდა პირველივე გამოყენებიდან.",
    product: "ყავის სკრაბი"
  }
]

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5 mb-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div
    className="rounded-3xl p-6 bg-white mb-4 flex-shrink-0"
    style={{
      boxShadow:
        "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px",
    }}
  >
    <StarRating rating={testimonial.rating} />

    <p className="text-foreground/80 leading-relaxed mb-4 text-pretty font-medium text-xl font-serif tracking-wide">
      &ldquo;{testimonial.text}&rdquo;
    </p>

    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-foreground text-sm font-bold">{testimonial.name}</p>
        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
      </div>
      <span className="text-xs tracking-wide text-primary/70 bg-primary/5 px-2 py-1 rounded-full whitespace-nowrap">
        {testimonial.product}
      </span>
    </div>
  </div>
)

export function Testimonials() {
  const [headerVisible, setHeaderVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  const column1 = [testimonials[0], testimonials[3], testimonials[6]]
  const column2 = [testimonials[1], testimonials[4], testimonials[7]]
  const column3 = [testimonials[2], testimonials[5], testimonials[8]]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true)
      },
      { threshold: 0.1 }
    )
    if (headerRef.current) observer.observe(headerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-24 bg-background overflow-hidden pb-24 pt-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span
            className={`text-sm tracking-[0.3em] uppercase text-primary mb-4 block ${
              headerVisible ? "animate-blur-in opacity-0" : "opacity-0"
            }`}
            style={headerVisible ? { animationDelay: "0.2s", animationFillMode: "forwards" } : {}}
          >
            შეფასებები
          </span>
          <h2
            className={`font-serif text-4xl leading-tight text-foreground text-balance md:text-7xl ${
              headerVisible ? "animate-blur-in opacity-0" : "opacity-0"
            }`}
            style={headerVisible ? { animationDelay: "0.4s", animationFillMode: "forwards" } : {}}
          >
            რას ამბობენ მომხმარებლები
          </h2>
        </div>

        {/* Scrolling Testimonials */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

          {/* Mobile — Single Column */}
          <div className="md:hidden h-[600px]">
            <div className="relative overflow-hidden h-full">
              <div className="animate-scroll-down">
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <TestimonialCard key={`mobile-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop — Three Columns */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 h-[600px]">
            <div className="relative overflow-hidden">
              <div className="animate-scroll-down">
                {[...column1, ...column1].map((testimonial, index) => (
                  <TestimonialCard key={`col1-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div className="animate-scroll-up">
                {[...column2, ...column2].map((testimonial, index) => (
                  <TestimonialCard key={`col2-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div className="animate-scroll-down">
                {[...column3, ...column3].map((testimonial, index) => (
                  <TestimonialCard key={`col3-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
